<#
.SYNOPSIS
    Diagnostic check for sprite frame consistency.
    Run after any frame extraction, cleanup, or normalization pass.

.USAGE
    powershell -ExecutionPolicy Bypass -File scripts\check_sprite_frames.ps1
    powershell -ExecutionPolicy Bypass -File scripts\check_sprite_frames.ps1 -Dir public\bear-frames -Strips "frame,turn_front" -Count 9 -ExpectedW 150 -ExpectedH 145 -ExpectedMaxY 144

.CHECKS
    1. Canvas dimensions   -- all frames must be ExpectedW x ExpectedH
    2. Ground anchor       -- maxY must equal ExpectedMaxY (feet at canvas bottom)
    3. Height consistency  -- minY spread within each strip must be <= MaxMinYSpread
    4. Border artifacts    -- wide pixel rows near top/bottom indicate card borders;
                             pixels in the top LabelClearRows rows indicate label bleed
    5. Horizontal center   -- body center X must be within MaxCenterDeviationX of canvas center
                             (critical for scaleX flip characters)
    6. Body size spread    -- body width (BodyW) spread within a strip must be <= MaxBodyWSpread;
                             a frame significantly wider or narrower than its neighbors will appear
                             to shrink/grow during animation
#>

param(
    [string]$Dir                 = "public\sheep-frames",
    [string]$Strips              = "walk_left,walk_right,walk_down,walk_up",
    [int]   $Count               = 8,
    [int]   $ExpectedW           = 133,
    [int]   $ExpectedH           = 165,
    [int]   $ExpectedMaxY        = 164,
    [int]   $MaxMinYSpread       = 4,
    [string]$HoldStrips          = "walk_down",

    # Border checks
    [int]   $LabelClearRows      = 20,    # rows from top that must be empty
    [float] $BorderSpanRatio     = 0.60,  # row spanning >60% of canvas width = card border
    [int]   $BorderScanRows      = 15,    # rows from top/bottom to scan for borders

    # Centering checks
    [int]   $MaxCenterDeviationX = 12,    # max body-center deviation from canvas center (px)
    [switch]$SkipCenterCheck     = $false, # set for explicit-strip characters (no scaleX flip)

    # Body size spread
    [int]   $MaxBodyWSpread      = 20,    # max allowed body-width spread within one strip (px)
    # Strips where higher body-width variation is expected (front/back facing -- legs extend sideways)
    [string]$WideBodyStrips      = "walk_down,walk_up",
    [int]   $MaxBodyWSpreadWide  = 30     # relaxed threshold for WideBodyStrips
)

Add-Type -AssemblyName System.Drawing

function Measure-Frame($path) {
    if (-not (Test-Path $path)) { return $null }
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $W = $bmp.Width; $H = $bmp.Height
    $minY = $H; $maxY = 0; $minX = $W; $maxX = 0
    $rowSpans = @{}

    for ($y = 0; $y -lt $H; $y++) {
        $rMinX = $W; $rMaxX = -1; $rCount = 0
        for ($x = 0; $x -lt $W; $x++) {
            if ($bmp.GetPixel($x, $y).A -gt 10) {
                $rCount++
                if ($x -lt $rMinX) { $rMinX = $x }
                if ($x -gt $rMaxX) { $rMaxX = $x }
                if ($y -lt $minY)  { $minY = $y }
                if ($y -gt $maxY)  { $maxY = $y }
                if ($x -lt $minX)  { $minX = $x }
                if ($x -gt $maxX)  { $maxX = $x }
            }
        }
        if ($rCount -gt 0) {
            $rowSpans[$y] = @{ Count=$rCount; MinX=$rMinX; MaxX=$rMaxX; Span=($rMaxX - $rMinX + 1) }
        }
    }
    $bmp.Dispose()

    return @{
        Path     = $path
        W        = $W; H = $H
        MinY     = $minY; MaxY = $maxY
        MinX     = $minX; MaxX = $maxX
        BodyH    = ($maxY - $minY + 1)
        BodyW    = ($maxX - $minX + 1)
        CenterX  = [int](($minX + $maxX) / 2)
        RowSpans = $rowSpans
    }
}

function Get-BorderIssues($m, $fname) {
    $issues = @()
    $W = $m.W

    # Label zone: top LabelClearRows rows must be empty
    for ($y = 0; $y -lt $LabelClearRows; $y++) {
        if ($m.RowSpans.ContainsKey($y)) {
            $issues += "LABEL ARTIFACT: $fname pixels at y=$y (top $LabelClearRows rows must be clear)"
            break
        }
    }

    # Wide rows near top (card border outline)
    $topEnd = [math]::Min($LabelClearRows + $BorderScanRows, $m.H)
    for ($y = $LabelClearRows; $y -lt $topEnd; $y++) {
        if ($m.RowSpans.ContainsKey($y)) {
            $span = $m.RowSpans[$y].Span
            $pct  = [int]($span * 100 / $W)
            if ($span -gt ($W * $BorderSpanRatio)) {
                $issues += "TOP BORDER: $fname y=$y span=$span/$W px ($pct% width) -- card border outline"
            }
        }
    }

    # Wide rows near bottom (card base line or shadow)
    # Only flag rows that are sparse (low density) or extremely wide
    $botStart = [math]::Max($m.MaxY - $BorderScanRows, 0)
    for ($y = $botStart; $y -le $m.MaxY; $y++) {
        if ($m.RowSpans.ContainsKey($y)) {
            $span    = $m.RowSpans[$y].Span
            $density = $m.RowSpans[$y].Count / $span
            $pct     = [int]($span * 100 / $W)
            if ($span -gt ($W * $BorderSpanRatio)) {
                if ($density -lt 0.75) {
                    $issues += "BOTTOM BORDER: $fname y=$y span=$span/$W px density=$([math]::Round($density,2)) -- sparse wide row (card base arc)"
                } elseif ($span -gt ($W * 0.85)) {
                    $issues += "BOTTOM BORDER: $fname y=$y span=$span/$W px ($pct% width) -- very wide row, possible card base"
                }
            }
        }
    }

    return $issues
}

function Get-CenterIssue($m, $fname, $canvasCenter) {
    $dev = [math]::Abs($m.CenterX - $canvasCenter)
    if ($dev -gt $MaxCenterDeviationX) {
        return "OFF-CENTER: $fname bodyCenter=$($m.CenterX) canvasCenter=$canvasCenter deviation=${dev}px (max $MaxCenterDeviationX) -- scaleX flip will jump"
    }
    return $null
}

# ---- Main loop ----

$errors   = @()
$allOk    = $true
$stripList = $Strips -split ","
$holdList  = $HoldStrips -split ","
$canvasCenter = [int]($ExpectedW / 2)

foreach ($strip in $stripList) {
    $frames      = @()
    $stripErrors = @()

    for ($i = 0; $i -lt $Count; $i++) {
        $path = Join-Path $Dir "${strip}_${i}.png"
        $m = Measure-Frame $path
        if ($null -eq $m) {
            $stripErrors += "MISSING: $path"; $allOk = $false; continue
        }
        $frames += $m
        $fname = "${strip}_${i}"

        # Canvas size
        if ($m.W -ne $ExpectedW -or $m.H -ne $ExpectedH) {
            $stripErrors += "CANVAS SIZE: $fname is $($m.W)x$($m.H), expected ${ExpectedW}x${ExpectedH}"
            $allOk = $false
        }

        # Ground anchor
        if ($m.MaxY -ne $ExpectedMaxY) {
            $stripErrors += "GROUND ANCHOR: $fname maxY=$($m.MaxY), expected $ExpectedMaxY"
            $allOk = $false
        }

        # Border artifacts
        $bIssues = Get-BorderIssues $m $fname
        foreach ($bi in $bIssues) { $stripErrors += $bi; $allOk = $false }

        # Centering (skip hold frame and if flag set)
        $isHoldFrame = ($holdList -contains $strip) -and ($i -eq 0)
        if (-not $SkipCenterCheck -and -not $isHoldFrame) {
            $ci = Get-CenterIssue $m $fname $canvasCenter
            if ($ci) { $stripErrors += $ci; $allOk = $false }
        }
    }

    $errors += $stripErrors
    if ($frames.Count -eq 0) { continue }

    # Height spread (exclude hold frame 0 for hold strips)
    $isHoldStrip  = $holdList -contains $strip
    $spreadFrames = if ($isHoldStrip) { $frames | Select-Object -Skip 1 } else { $frames }
    $minYVals  = $spreadFrames | ForEach-Object { $_.MinY }
    $minMinY   = ($minYVals | Measure-Object -Minimum).Minimum
    $maxMinY   = ($minYVals | Measure-Object -Maximum).Maximum
    $spread    = $maxMinY - $minMinY
    if ($spread -gt $MaxMinYSpread) {
        $errors += "HEIGHT INCONSISTENCY: $strip minY spread=${spread}px"; $allOk = $false
    }

    # Center X spread across strip
    $cxVals   = $spreadFrames | ForEach-Object { $_.CenterX }
    $minCX    = ($cxVals | Measure-Object -Minimum).Minimum
    $maxCX    = ($cxVals | Measure-Object -Maximum).Maximum
    $avgCX    = [math]::Round(($cxVals | Measure-Object -Average).Average, 1)

    # Body width spread across strip
    $bwVals    = $spreadFrames | ForEach-Object { $_.BodyW }
    $minBodyW  = ($bwVals | Measure-Object -Minimum).Minimum
    $maxBodyW  = ($bwVals | Measure-Object -Maximum).Maximum
    $bwSpread  = $maxBodyW - $minBodyW
    $wideList  = $WideBodyStrips -split ","
    $bwThreshold = if ($wideList -contains $strip) { $MaxBodyWSpreadWide } else { $MaxBodyWSpread }
    if ($bwSpread -gt $bwThreshold) {
        $errors  += "BODY WIDTH INCONSISTENCY: $strip bodyW spread=${bwSpread}px (min=$minBodyW max=$maxBodyW) -- frames vary in size"
        $allOk    = $false
    }

    $avgBodyH = [math]::Round(($frames | ForEach-Object { $_.BodyH } | Measure-Object -Average).Average, 1)
    $avgBodyW = [math]::Round(($bwVals | Measure-Object -Average).Average, 1)

    $holdNote   = if ($isHoldStrip)          { " [frame0=hold minY=$($frames[0].MinY)]" } else { "" }
    $centerNote = if (-not $SkipCenterCheck) { " cx=$minCX..$maxCX(avg=$avgCX,canvas=$canvasCenter)" } else { "" }
    $sizeNote   = " bodyW=$minBodyW..$maxBodyW(avg=$avgBodyW)"
    $hasErr     = $stripErrors.Count -gt 0 -or $spread -gt $MaxMinYSpread -or $bwSpread -gt $bwThreshold
    $status     = if ($hasErr) { "FAIL" } else { "OK" }

    Write-Host ("  [{0,-4}] {1,-14} frames={2} minY={3}..{4}(spread={5}) bodyH={6}{7}{8}{9}" -f `
        $status, $strip, $frames.Count, $minMinY, $maxMinY, $spread, $avgBodyH, $sizeNote, $holdNote, $centerNote)
}

Write-Host ""
if ($errors.Count -gt 0) {
    Write-Host "=== ERRORS ($($errors.Count)) ===" -ForegroundColor Red
    foreach ($e in $errors) { Write-Host "  $e" -ForegroundColor Red }
} else {
    Write-Host "All checks passed." -ForegroundColor Green
}
