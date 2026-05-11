const baseUrl = process.env.RESUME_BASE_URL ?? 'http://127.0.0.1:3001'

const checks = [
  {
    path: '/pgx/resume',
    contentType: 'text/html',
    terms: [
      'application/ld+json',
      'ProfilePage',
      'Person',
      'Founder and Principal AI Automation Engineer',
      'Supabase',
      'MuleSoft',
      'Amazon Connect',
      'Microsoft Fabric',
      'Data Lake',
    ],
  },
  {
    path: '/pgx/resume/ats',
    contentType: 'text/html',
    terms: [
      'Professional Summary',
      'Experience',
      'Skills',
      'Projects',
      'Founder &amp; Principal AI Automation Engineer',
      'Apr 2026',
      '$2M',
      '10+',
      '100+',
    ],
  },
  {
    path: '/pgx/resume/text',
    contentType: 'text/plain',
    terms: [
      'Professional Summary',
      'Target Roles',
      'AI automation',
      'Next.js',
      'Supabase',
      'Remotion',
      'Azure DevOps',
      'Microsoft Fabric',
      'Data Lake',
    ],
  },
  {
    path: '/llms.txt',
    contentType: 'text/plain',
    terms: [
      'Canonical Resume',
      'ATS Resume',
      'Plain Resume Text',
      'AI automation',
      'enterprise integration',
    ],
  },
]

let failures = 0
const bodies = new Map()

for (const check of checks) {
  const url = new URL(check.path, baseUrl)
  const response = await fetch(url)
  const body = await response.text()
  const contentType = response.headers.get('content-type') ?? ''
  let checkFailures = 0
  bodies.set(check.path, body)

  if (!response.ok) {
    console.error(`FAIL ${check.path}: HTTP ${response.status}`)
    failures += 1
    checkFailures += 1
    continue
  }

  if (!contentType.includes(check.contentType)) {
    console.error(`FAIL ${check.path}: expected ${check.contentType}, got ${contentType}`)
    failures += 1
    checkFailures += 1
  }

  for (const term of check.terms) {
    if (!body.includes(term)) {
      console.error(`FAIL ${check.path}: missing "${term}"`)
      failures += 1
      checkFailures += 1
    }
  }

  if (checkFailures === 0) {
    console.log(`PASS ${check.path}`)
  }
}

const resumeText = bodies.get('/pgx/resume/text') ?? ''
const llmsText = bodies.get('/llms.txt') ?? ''

if (resumeText && llmsText) {
  failures += validateLlmsTxtCoverage(resumeText, llmsText)
}

if (failures > 0) {
  console.error(`${failures} resume machine-readable checks failed.`)
  process.exit(1)
}

console.log('All resume machine-readable checks passed.')

function validateLlmsTxtCoverage(resumeText, llmsText) {
  let coverageFailures = 0
  const expectedRoutes = [
    '/pgx/resume',
    '/pgx/resume/ats',
    '/pgx/resume/text',
    '/pgx/resume/story',
  ]
  const targetRoles = extractListSection(resumeText, 'Target Roles', 'Key Metrics')
  const projectNames = extractProjectNames(resumeText)

  for (const route of expectedRoutes) {
    if (!llmsText.includes(route)) {
      console.error(`FAIL /llms.txt: missing route "${route}"`)
      coverageFailures += 1
    }
  }

  for (const role of targetRoles) {
    if (!llmsText.includes(role)) {
      console.error(`FAIL /llms.txt: missing target role "${role}"`)
      coverageFailures += 1
    }
  }

  for (const project of projectNames) {
    if (!llmsText.includes(project)) {
      console.error(`FAIL /llms.txt: missing proof project "${project}"`)
      coverageFailures += 1
    }
  }

  if (coverageFailures === 0) {
    console.log('PASS /llms.txt coverage')
  }

  return coverageFailures
}

function extractListSection(text, startHeading, endHeading) {
  const section = extractSection(text, startHeading, endHeading)
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

function extractProjectNames(text) {
  const section = extractSection(text, 'Projects', 'Education')
  const lines = section
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const names = []
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const next = lines[index + 1] ?? ''
    if (!line.startsWith('http') && next && !next.startsWith('http')) {
      names.push(line)
      index += next.startsWith('http') ? 1 : 2
    }
  }

  return names
}

function extractSection(text, startHeading, endHeading) {
  const start = text.indexOf(`\n${startHeading}\n`)
  if (start === -1) {
    return ''
  }

  const contentStart = start + startHeading.length + 2
  const end = text.indexOf(`\n${endHeading}\n`, contentStart)
  return text.slice(contentStart, end === -1 ? undefined : end).trim()
}
