// src/app/resume/components/PaperResume.tsx
'use client'
import { motion } from 'framer-motion'
import { RESUME_ROLES, SKILL_GROUPS, METRICS, PROJECTS } from '../data/resume'

export default function PaperResume() {
  return (
    <motion.section
      className="min-h-screen bg-slate-100 flex flex-col items-center py-16 px-4 print:bg-white print:py-0 print:min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full flex justify-end mb-3 print:hidden" style={{ maxWidth: 820 }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '6px 16px', fontSize: 11, fontFamily: 'sans-serif', cursor: 'pointer',
            background: 'rgba(30,64,175,0.07)', border: '1px solid rgba(30,64,175,0.2)',
            color: '#1e40af', borderRadius: 6, letterSpacing: 0.5,
          }}
        >
          ↓ Download PDF
        </button>
      </div>
      <motion.div
        className="w-full bg-white overflow-hidden print:overflow-visible"
        style={{
          maxWidth: 820,
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Header band */}
        <div style={{
          background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1e40af 100%)',
          padding: 'clamp(20px, 4vw, 32px) clamp(16px, 5vw, 40px) 24px',
          color: 'white',
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.15, margin: 0 }}>
            <span>Paul P.</span>{' '}
            <strong style={{ fontWeight: 700, color: '#60a5fa' }}>Xiong</strong>
          </h1>
          <div style={{
            fontSize: 14, color: '#cbd5e1', fontFamily: 'sans-serif',
            marginTop: 6, letterSpacing: 0.5,
          }}>
            Strategic Software Dev Manager &amp; Solutions Architect
          </div>
          <div style={{
            display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap',
            fontSize: 11, color: '#94a3b8', fontFamily: 'sans-serif',
          }}>
            <ContactItem label="Orange County, CA · Twin Cities, MN" />
            <ContactItemSep />
            <ContactItem label="pgxiong@gmail.com" />
            <ContactItemSep />
            <ContactItem label="LinkedIn" href="/resume/contact" />
            <ContactItemSep />
            <ContactItem label="zencloudweb.com" href="https://zencloudweb.com" />
          </div>
        </div>

        {/* Metrics band */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200"
        >
          {METRICS.map((m, i) => (
            <div key={m.label} style={{
              padding: '16px 12px', textAlign: 'center',
              borderRight: i < METRICS.length - 1 ? '1px solid #e2e8f0' : 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1e3a5f' }}>{m.value}</div>
              <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row px-5 sm:px-8 md:px-10 py-8 gap-8 md:gap-9">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            <SectionTitle>Professional Summary</SectionTitle>
            <p style={{
              fontSize: 12, color: '#334155', lineHeight: 1.7, fontFamily: 'sans-serif',
              marginBottom: 24,
            }}>
              Enterprise architect and engineering manager who bridges legacy .NET/MuleSoft
              integration with modern AI pipelines. Cut time-to-production 50%+ across 100+
              integrations. Currently leading a $2M, 10-engineer API team while shipping
              AI-automated video production tooling. Rare blend: enterprise-scale
              architecture credibility plus hands-on AI delivery.
            </p>

            <SectionTitle>Experience</SectionTitle>
            {RESUME_ROLES.map((role, i) => (
              <div key={i} style={{ marginBottom: i < RESUME_ROLES.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{role.role}</span>
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'sans-serif', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {role.dateRange}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#1e40af', fontFamily: 'sans-serif', marginBottom: 6 }}>
                  {role.company}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {role.bullets.map((b, j) => (
                    <li key={j} style={{
                      fontSize: 11, color: '#475569', lineHeight: 1.6, fontFamily: 'sans-serif',
                      marginBottom: 3,
                    }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-[220px] flex-shrink-0">
            <SectionTitle>Skills</SectionTitle>
            {SKILL_GROUPS.map(g => (
              <div key={g.name} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: '#1e40af', fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: 1, marginBottom: 5, textTransform: 'uppercase' }}>
                  {g.name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {g.items.map(s => (
                    <span key={s} style={{
                      padding: '2px 7px', borderRadius: 3,
                      fontSize: 9, fontFamily: 'sans-serif',
                      ...skillChipStyle(g.variant),
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <SectionTitle>Projects</SectionTitle>
            {PROJECTS.map(p => (
              <div key={p.name} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'sans-serif', lineHeight: 1.5 }}>{p.desc}</div>
                {'url' in p && p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: '#1e40af', fontFamily: 'sans-serif', textDecoration: 'none' }}>
                    {p.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            ))}

            <SectionTitle>Education</SectionTitle>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
              B.A. Computer Science — University of St. Thomas
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'sans-serif', lineHeight: 1.5, marginBottom: 10 }}>
              Saint Paul, MN · International study in China &amp; Japan
            </div>

            <SectionTitle>Target Roles</SectionTitle>
            <div style={{
              fontSize: 10, color: '#475569', fontFamily: 'sans-serif', lineHeight: 1.6,
              padding: '8px 10px', background: 'rgba(30,64,175,0.05)', borderRadius: 3,
              border: '1px solid rgba(30,64,175,0.1)',
            }}>
              AI Solutions Architect · Software Dev Manager, AI/Automation · LLMOps / Agentic Workflow Lead
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: 'clamp(10px, 2vw, 12px) clamp(16px, 5vw, 40px)',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 9, color: '#94a3b8', fontFamily: 'sans-serif', letterSpacing: 0.5,
        }}>
          <span>Orange County, CA · Twin Cities, MN</span>
          <span>zencloudweb.com</span>
        </div>
      </motion.div>
    </motion.section>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 10, color: '#1e3a5f', fontFamily: 'sans-serif',
      letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
      marginBottom: 10, paddingBottom: 5,
      borderBottom: '1px solid #e2e8f0',
    }}>
      {children}
    </div>
  )
}

function ContactItem({ label, href }: { label: string; href?: string }) {
  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{ color: '#94a3b8', textDecoration: 'none' }}
      >
        {label}
      </a>
    )
  }
  return <span>{label}</span>
}

function ContactItemSep() {
  return <span style={{ color: '#475569' }}>·</span>
}

function skillChipStyle(variant: 'default' | 'ai' | 'infra'): React.CSSProperties {
  switch (variant) {
    case 'ai':
      return { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#6d28d9' }
    case 'infra':
      return { background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)', color: '#0c7d96' }
    default:
      return { background: 'rgba(30,64,175,0.06)', border: '1px solid rgba(30,64,175,0.15)', color: '#1e40af' }
  }
}
