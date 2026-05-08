<#
.SYNOPSIS
    Diagnostic check for sprite frame consistency.
    Run after any frame extraction, cleanup, or normalization pass.

.USAGE
    powershell -ExecutionPolicy Bypass -File scripts\check_sprite_frames.ps1
    powershell -ExecutionPolicy Bypass -File scripts\check_sprite_frames.ps1 -Dir public\bear-frames -Prefix frame -Count 9

.PARAMETERS
    -Dir    : folder containing the frames (default: public\sheep-frames)
    -Strips : comma-separated list of strip prefixes to check (default: walk_left,walk_right,walk_down,walk_up)
    -Count  : number of frames per strip (default: 8)
#>

param(
    [string]$Dir    = "public\sheep-frames",
    [string]$Strips = "walk_left,walk_right,walk_down,walk_up",
    [int]   $Count  = 8,
    [int]   $ExpectedW = 133,
    [int]   $ExpectedH = 165,
    [int]   $ExpectedMaxY = 164,   # feet must touch this row
    [int]   $MaxMinYSpread = 4,    # max allowed minY variation within one strip
    # Strips where frame 0 is a special "hold" frame and may legitimately be taller
    [string]$HoldStrips = "walk_down"
)

Add-Type -AssemblyName System.Drawing

function Measure-Frame($path) {
    if (-not (Test-Path $path)) { return $null }
    $bmp   = [System.Drawing.Bitmap]::FromFile($path)
    $minY  = $bmp.Height; $maxY = 0
    $minX  = $bmp.Width;  $maxX = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            if ($bmp.GetPixel($x, $y).A -gt 10) {
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    $result = @{
        Path   = $path
        W      = $bmp.Width
        H      = $bmp.Height
        MinY   = $minY
        MaxY   = $maxY
        MinX   = $minX
        MaxX   = $maxX
        BodyH  = ($maxY - $minY + 1)
        BodyW  = ($maxX - $minX + 1)
    }
    $bmp.Dispose()
    return $result
}

$errors   = @()
$warnings = @()
$allOk    = $true

$stripList = $Strips -split ","

foreach ($strip in $stripList) {
    $frames = @()
    for ($i = 0; $i -lt $Count; $i++) {
        $path = Join-Path $Dir "$strip`_$i.png"
        $m = Measure-Frame $path
        if ($null -eq $m) {
            $errors += "MISSING: $path"
            $allOk = $false
            continue
        }
        $frames += $m

        # Canvas size check
        if ($m.W -ne $ExpectedW -or $m.H -ne $ExpectedH) {
            $errors += "CANVAS SIZE: $strip`_$i is $($m.W)x$($m.H), expected ${ExpectedW}x${ExpectedH}"
            $allOk = $false
        }
        # Ground anchor check
        if ($m.MaxY -ne $ExpectedMaxY) {
            $errors += "GROUND ANCHOR: $strip`_$i maxY=$($m.MaxY), expected $ExpectedMaxY (feet not at canvas bottom)"
            $allOk = $false
        }
    }

    if ($frames.Count -eq 0) { continue }

    # minY spread check (body top consistency within the strip)
    # For "hold" strips (e.g. walk_down), frame 0 is a special full-canopy still frame
    # used only for the hold phase — exclude it from the spread check.
    $isHoldStrip = ($HoldStrips -split ",") -contains $strip
    $spreadFrames = if ($isHoldStrip) { $frames | Select-Object -Skip 1 } else { $frames }
    $minYValues = $spreadFrames | ForEach-Object { $_.MinY }
    $minMinY    = ($minYValues | Measure-Object -Minimum).Minimum
    $maxMinY    = ($minYValues | Measure-Object -Maximum).Maximum
    $spread     = $maxMinY - $minMinY

    if ($spread -gt $MaxMinYSpread) {
        $errors += "HEIGHT INCONSISTENCY: $strip minY spread=${spread}px (frames: $(($frames | ForEach-Object { "$($_.Path.Split('\')[-1]):$($_.MinY)" }) -join ', '))"
        $allOk = $false
    }

    # Report frame 0 hold height separately for hold strips
    $holdNote = if ($isHoldStrip) { " [frame0=hold minY=$($frames[0].MinY)]" } else { "" }

    # Summary line for this strip
    $avgBodyH = [math]::Round(($frames | ForEach-Object { $_.BodyH } | Measure-Object -Average).Average, 1)
    $status = if ($spread -le $MaxMinYSpread -and ($errors | Where-Object { $_ -like "*$strip*" }).Count -eq 0) { "OK" } else { "FAIL" }
    Write-Host ("  [{0,-4}] {1,-14} frames={2} minY={3}..{4} (spread={5}) avgBodyH={6}{7}" -f $status, $strip, $frames.Count, $minMinY, $maxMinY, $spread, $avgBodyH, $holdNote)
}

Write-Host ""
if ($errors.Count -gt 0) {
    Write-Host "=== ERRORS ($($errors.Count)) ===" -ForegroundColor Red
    foreach ($e in $errors) { Write-Host "  $e" -ForegroundColor Red }
} else {
    Write-Host "All checks passed." -ForegroundColor Green
}
