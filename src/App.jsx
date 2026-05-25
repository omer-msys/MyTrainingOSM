import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, BookOpen, Cog, Plug, PlayCircle, AlertCircle,
  Bell, Search, ChevronRight, ChevronDown, ArrowRight, Check, X,
  Clock, FileText, Database, Shield, Users, Activity, Zap,
  Upload, Filter, MoreHorizontal, ExternalLink, Sparkles,
  Eye, GitBranch, Server, Key, Lock, AlertTriangle, Plus,
  Brain, Cpu, Loader2, ChevronLeft, Calendar, TrendingUp,
  FileCheck2, ScanLine, Workflow, Network,
  Bot, UserCog, ScrollText, Settings2, BarChart3, Pencil,
  Power, History, Gauge, Code2, MessageSquare, Boxes
} from 'lucide-react';

// ───────────────────────────────────────────────────────────
//  ADASTRA DESIGN TOKENS
//  Crimson primary, charcoal ink, lots of white, editorial type
// ───────────────────────────────────────────────────────────
const T = {
  red:        '#E2231A',
  redDark:    '#B81B14',
  redSoft:    '#FDECEB',
  redTint:    '#FFF6F5',
  ink:        '#0A0A0A',
  ink2:       '#2A2A2A',
  ink3:       '#525252',
  muted:      '#737373',
  faint:      '#A3A3A3',
  rule:       '#E5E5E5',
  ruleSoft:   '#F0F0F0',
  surface:    '#FAFAFA',
  paper:      '#FFFFFF',
  ok:         '#0B7A4F',
  okSoft:     '#E6F4EE',
  warn:       '#B45309',
  warnSoft:   '#FEF3C7',
  bad:        '#B91C1C',
  badSoft:    '#FEE2E2',
};

// ───────────────────────────────────────────────────────────
//  MOCK DATA
// ───────────────────────────────────────────────────────────
const KPIS = [
  { label: 'Active audits',        value: '14', delta: '+3 this week',    accent: T.red },
  { label: 'Controls monitored',   value: '2,847', delta: '99.2% covered',accent: T.ink },
  { label: 'Open findings',        value: '23',  delta: '−7 vs last wk',  accent: T.warn },
  { label: 'Auditor hours saved',  value: '4,210', delta: 'QTD',          accent: T.ok },
];

const RECENT_AUDITS = [
  { id: 'AUD-2026-114', name: 'Q2 SOX 404 Controls Testing',          owner: 'M. Chen',    framework: 'SOX',  status: 'running',   progress: 64, started: '2h ago' },
  { id: 'AUD-2026-113', name: 'ITGC Access Review · Investment Bank', owner: 'R. Patel',   framework: 'COBIT',status: 'review',    progress: 100,started: '1d ago' },
  { id: 'AUD-2026-112', name: 'AWS Privileged Access Audit',          owner: 'J. Adeyemi', framework: 'NIST', status: 'running',   progress: 31, started: '6h ago' },
  { id: 'AUD-2026-111', name: 'Q1 Vendor SOC 2 Reliance Review',      owner: 'S. Kowalski',framework: 'TPRM', status: 'complete',  progress: 100,started: '3d ago' },
  { id: 'AUD-2026-110', name: 'GL Journal Entry Anomalies — March',   owner: 'A. Singh',   framework: 'SOX',  status: 'complete',  progress: 100,started: '5d ago' },
];

const KNOWLEDGE = [
  { id: 'K-001', title: 'NIST Cybersecurity Framework 2.0',         type: 'Standard',  pages: 47, ingested: '2026-04-12', status: 'indexed', rules: 89  },
  { id: 'K-002', title: 'SOX Section 404 — Internal Controls',      type: 'Regulation',pages: 23, ingested: '2026-04-09', status: 'indexed', rules: 142 },
  { id: 'K-003', title: 'COBIT 2019 — IT Governance',               type: 'Framework', pages: 312,ingested: '2026-04-08', status: 'indexed', rules: 267 },
  { id: 'K-004', title: 'Internal Policy — Privileged Access Mgmt', type: 'Policy',    pages: 14, ingested: '2026-04-05', status: 'indexed', rules: 31  },
  { id: 'K-005', title: 'DORA — Digital Operational Resilience',    type: 'Regulation',pages: 89, ingested: '2026-05-22', status: 'processing', rules: 0, progress: 73 },
  { id: 'K-006', title: 'PCI DSS 4.0',                              type: 'Standard',  pages: 67, ingested: '2026-03-18', status: 'indexed', rules: 108 },
];

const RULES = [
  { id: 'R-2451', title: 'Every privileged account must have MFA enabled',         source: 'NIST PR.AC-1',   severity: 'critical', status: 'active',  lastRun: '12m ago' },
  { id: 'R-2450', title: 'Dormant accounts (>60d) must be disabled',                source: 'NIST PR.AC-1',   severity: 'high',     status: 'active',  lastRun: '12m ago' },
  { id: 'R-2449', title: 'No shared credentials for production systems',           source: 'Internal PAM',   severity: 'critical', status: 'active',  lastRun: '12m ago' },
  { id: 'R-2448', title: 'Quarterly access certification by control owner',        source: 'SOX 404',        severity: 'high',     status: 'active',  lastRun: '3d ago'  },
  { id: 'R-2447', title: 'All admin actions logged to immutable store',            source: 'NIST PR.PT-1',   severity: 'high',     status: 'active',  lastRun: '12m ago' },
  { id: 'R-2446', title: 'Vendor SOC 2 reports refreshed annually',                source: 'OCC 2013-29',    severity: 'medium',   status: 'active',  lastRun: '1d ago'  },
  { id: 'R-2445', title: 'Journal entries above $1M require dual approval',        source: 'SOX 302',        severity: 'critical', status: 'active',  lastRun: '1h ago'  },
  { id: 'R-2444', title: 'Key rotation every 90 days for production secrets',      source: 'PCI DSS 3.6',    severity: 'high',     status: 'active',  lastRun: '12m ago' },
  { id: 'R-2443', title: 'No direct prod database access for developers',          source: 'Internal PAM',   severity: 'critical', status: 'pending', lastRun: '—' },
];

const CONNECTORS = [
  { name: 'Okta',            cat: 'Identity',      status: 'connected',    icon: 'O',  color: '#007DC1' },
  { name: 'Active Directory',cat: 'Identity',      status: 'connected',    icon: 'AD', color: '#0078D4' },
  { name: 'SailPoint',       cat: 'Identity',      status: 'connected',    icon: 'SP', color: '#0073AA' },
  { name: 'SAP S/4HANA',     cat: 'ERP',           status: 'connected',    icon: 'SAP',color: '#0FAAFF' },
  { name: 'Oracle Financials',cat: 'ERP',          status: 'connected',    icon: 'O',  color: '#C74634' },
  { name: 'Workday',         cat: 'HRIS',          status: 'connected',    icon: 'W',  color: '#F38B00' },
  { name: 'ServiceNow',      cat: 'ITSM',          status: 'connected',    icon: 'SN', color: '#62D84E' },
  { name: 'AWS CloudTrail',  cat: 'Cloud',         status: 'connected',    icon: 'AWS',color: '#FF9900' },
  { name: 'Azure Activity',  cat: 'Cloud',         status: 'connected',    icon: 'Az', color: '#0078D4' },
  { name: 'Splunk',          cat: 'Security',      status: 'connected',    icon: 'S',  color: '#65A637' },
  { name: 'CrowdStrike',     cat: 'Security',      status: 'available',    icon: 'CS', color: '#FA0000' },
  { name: 'GitHub',          cat: 'Change',        status: 'available',    icon: 'GH', color: '#181717' },
  { name: 'Jira',            cat: 'Change',        status: 'connected',    icon: 'J',  color: '#0052CC' },
  { name: 'AuditBoard',      cat: 'GRC',           status: 'available',    icon: 'AB', color: '#1F4E79' },
];

const AGENT_TIMELINE = [
  { t: '14:02:11', agent: 'Orchestrator',     action: 'Audit plan generated — 47 controls in scope', status: 'done' },
  { t: '14:02:14', agent: 'Evidence Collector',action: 'Connecting to Okta, Active Directory, SailPoint', status: 'done' },
  { t: '14:02:38', agent: 'Evidence Collector',action: 'Pulled 12,847 entitlement records', status: 'done' },
  { t: '14:03:02', agent: 'Rule Executor',     action: 'Executing R-2451: MFA on privileged accounts', status: 'done' },
  { t: '14:03:09', agent: 'Rule Executor',     action: '4 violations found — drafting evidence pack', status: 'done' },
  { t: '14:03:21', agent: 'Anomaly Detector',  action: 'Scanning for toxic SoD combinations', status: 'done' },
  { t: '14:03:44', agent: 'Anomaly Detector',  action: 'Detected: user with both AP-Create and AP-Approve', status: 'flag' },
  { t: '14:03:58', agent: 'Narrative Drafter', action: 'Generating finding memo for SoD violation', status: 'running' },
  { t: '14:04:02', agent: 'Citation Validator',action: 'Verifying source links for all claims', status: 'queued' },
];

const FINDINGS = [
  { id: 'F-1842', title: 'Privileged account without MFA enabled',                     severity: 'critical', audit: 'AWS Privileged Access', owner: 'CloudOps', status: 'open',     age: '2h' },
  { id: 'F-1841', title: 'Segregation of duties violation — AP Create + Approve',      severity: 'critical', audit: 'Q2 SOX 404',           owner: 'Finance IT',status: 'open',     age: '4h' },
  { id: 'F-1840', title: 'Dormant admin account active for 94 days',                   severity: 'high',     audit: 'ITGC Access Review',    owner: 'IdAM',      status: 'in remediation', age: '1d' },
  { id: 'F-1839', title: 'Vendor SOC 2 report expired (Acme Cloud Inc.)',              severity: 'medium',   audit: 'Vendor SOC 2',          owner: 'Vendor Mgmt',status: 'open',    age: '2d' },
  { id: 'F-1838', title: 'Journal entry posted on weekend without approval workflow',  severity: 'high',     audit: 'GL JE Anomalies',       owner: 'Controllership',status: 'remediated', age: '5d' },
];

const MONITORS = [
  { name: 'Privileged access drift',  scope: 'IAM systems',       trigger: 'Entitlement change',  window: 'Real-time', alerts24h: 3 },
  { name: 'JE anomaly detection',     scope: 'GL postings',       trigger: 'Posting event',       window: 'Real-time', alerts24h: 7 },
  { name: 'Cloud config drift',       scope: 'AWS, Azure',        trigger: 'Config change',       window: '15 min',    alerts24h: 12 },
  { name: 'Vendor risk signals',      scope: 'OSINT, news feeds', trigger: 'External event',      window: 'Hourly',    alerts24h: 1 },
  { name: 'Key rotation compliance',  scope: 'Vault, KMS',        trigger: 'Daily scan',          window: 'Daily',     alerts24h: 0 },
];

const MONITOR_EVENTS = [
  { time: '14:03', monitor: 'JE anomaly detection',    msg: 'JE-44218 flagged: $2.4M, weekend, single-approver',     sev: 'high' },
  { time: '13:58', monitor: 'Privileged access drift', msg: 'New admin role granted to user u-8821 in prod-us-east', sev: 'critical' },
  { time: '13:51', monitor: 'Cloud config drift',      msg: 'S3 bucket "fin-reports-q2" ACL changed to public-read', sev: 'critical' },
  { time: '13:42', monitor: 'JE anomaly detection',    msg: 'JE-44213 flagged: round-dollar, post-close period',     sev: 'medium' },
  { time: '13:30', monitor: 'Cloud config drift',      msg: 'IAM policy attached without ticket — user u-3341',      sev: 'high' },
  { time: '12:47', monitor: 'Vendor risk signals',     msg: 'Vendor "DataLink Corp" disclosed breach (NYT)',         sev: 'critical' },
];

// ───────────────────────────────────────────────────────────
//  PRIMITIVES
// ───────────────────────────────────────────────────────────
const Badge = ({ tone = 'neutral', children, size = 'sm' }) => {
  const tones = {
    red:     { bg: T.redSoft,  fg: T.redDark, bd: '#F8C8C5' },
    ok:      { bg: T.okSoft,   fg: T.ok,      bd: '#BFE3D2' },
    warn:    { bg: T.warnSoft, fg: T.warn,    bd: '#F8DDA0' },
    bad:     { bg: T.badSoft,  fg: T.bad,     bd: '#F8C8C5' },
    neutral: { bg: T.surface,  fg: T.ink2,    bd: T.rule },
    ink:     { bg: T.ink,      fg: T.paper,   bd: T.ink },
  };
  const t = tones[tone] || tones.neutral;
  const sz = size === 'xs' ? { px: 6, py: 1, fs: 10 } : { px: 8, py: 2, fs: 11 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${sz.py}px ${sz.px}px`, borderRadius: 4,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: sz.fs, fontWeight: 600, lineHeight: 1.2,
      letterSpacing: 0.2, fontFamily: 'Manrope, sans-serif',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
};

const SevDot = ({ sev }) => {
  const c = { critical: T.red, high: T.warn, medium: '#3B82F6', low: T.muted }[sev] || T.muted;
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c }} />;
};

const StatusPill = ({ status }) => {
  const map = {
    running:    { tone: 'red',     label: '● Running' },
    review:     { tone: 'warn',    label: '● Review' },
    complete:   { tone: 'ok',      label: '● Complete' },
    indexed:    { tone: 'ok',      label: '● Indexed' },
    processing: { tone: 'warn',    label: '● Processing' },
    connected:  { tone: 'ok',      label: '● Connected' },
    available:  { tone: 'neutral', label: '○ Available' },
    active:     { tone: 'ok',      label: '● Active' },
    pending:    { tone: 'warn',    label: '● Pending review' },
    open:       { tone: 'red',     label: '● Open' },
    'in remediation': { tone: 'warn', label: '● In remediation' },
    remediated: { tone: 'ok',      label: '● Remediated' },
  };
  const m = map[status] || { tone: 'neutral', label: status };
  return <Badge tone={m.tone} size="xs">{m.label}</Badge>;
};

// ───────────────────────────────────────────────────────────
//  SHELL — sidebar, topbar, content area
// ───────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    section: 'Workspace',
    items: [
      { id: 'dashboard',  label: 'Dashboard',           icon: LayoutDashboard },
      { id: 'knowledge',  label: 'Knowledge',           icon: BookOpen },
      { id: 'rules',      label: 'Rules',               icon: Cog },
      { id: 'connectors', label: 'Connectors',          icon: Plug },
      { id: 'audits',     label: 'Audits',              icon: PlayCircle },
      { id: 'monitoring', label: 'Continuous Monitor',  icon: Activity },
      { id: 'findings',   label: 'Findings',            icon: AlertCircle },
    ],
  },
  {
    section: 'Admin',
    items: [
      { id: 'admin-agents',   label: 'AI Agents',     icon: Bot },
      { id: 'admin-models',   label: 'Models',        icon: Boxes },
      { id: 'admin-prompts',  label: 'Prompts',       icon: MessageSquare },
      { id: 'admin-users',    label: 'Users & Roles', icon: UserCog },
      { id: 'admin-auditlog', label: 'Audit Log',     icon: ScrollText },
      { id: 'admin-settings', label: 'Settings',      icon: Settings2 },
    ],
  },
];

function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 240, background: T.paper, borderRight: `1px solid ${T.rule}`,
      display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Wordmark */}
      <div style={{ padding: '24px 20px 28px', borderBottom: `1px solid ${T.ruleSoft}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'Instrument Serif, serif', fontSize: 28, color: T.ink,
            fontWeight: 400, letterSpacing: -0.5, lineHeight: 1,
          }}>Adastra</span>
          <span style={{
            width: 4, height: 4, borderRadius: '50%', background: T.red,
            display: 'inline-block', alignSelf: 'center', marginBottom: 2,
          }} />
        </div>
        <div style={{
          fontFamily: 'Manrope, sans-serif', fontSize: 10, color: T.muted,
          letterSpacing: 2.5, marginTop: 4, fontWeight: 600, textTransform: 'uppercase',
        }}>Audit Genie</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 12px', flex: 1, overflowY: 'auto' }}>
        {NAV_SECTIONS.map((sec, sIdx) => (
          <div key={sec.section} style={{ marginBottom: sIdx < NAV_SECTIONS.length - 1 ? 18 : 0 }}>
            <div style={{
              fontSize: 10, color: T.faint, fontWeight: 700, letterSpacing: 1.5,
              padding: '0 8px 10px', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {sec.section}
              {sec.section === 'Admin' && (
                <span style={{
                  fontSize: 8, padding: '1px 5px', background: T.redSoft, color: T.redDark,
                  borderRadius: 2, fontWeight: 700, letterSpacing: 0.5,
                }}>RESTRICTED</span>
              )}
            </div>
            {sec.items.map(n => {
              const Icon = n.icon;
              const active = page === n.id;
              return (
                <button key={n.id} onClick={() => setPage(n.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                    width: '100%', border: 'none', background: active ? T.redTint : 'transparent',
                    color: active ? T.ink : T.ink3, fontSize: 13, fontWeight: active ? 600 : 500,
                    fontFamily: 'Manrope, sans-serif', cursor: 'pointer', borderRadius: 6,
                    textAlign: 'left', marginBottom: 2, position: 'relative',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surface; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {active && <span style={{
                    position: 'absolute', left: -12, top: 8, bottom: 8, width: 2.5, background: T.red, borderRadius: 2,
                  }} />}
                  <Icon size={15} strokeWidth={active ? 2 : 1.7} />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.ruleSoft}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: T.ink,
            color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontFamily: 'Manrope', fontWeight: 600,
          }}>MC</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, fontFamily: 'Manrope' }}>Maya Chen</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>Sr. Auditor · Platform Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '28px 36px 24px', borderBottom: `1px solid ${T.rule}`, background: T.paper,
    }}>
      <div>
        <div style={{
          fontSize: 10, color: T.muted, letterSpacing: 2, fontWeight: 600,
          fontFamily: 'Manrope, sans-serif', marginBottom: 6, textTransform: 'uppercase',
        }}>{subtitle}</div>
        <h1 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 34, fontWeight: 400,
          color: T.ink, letterSpacing: -0.8, margin: 0, lineHeight: 1.1,
        }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {actions}
      </div>
    </div>
  );
}

const Button = ({ children, variant = 'primary', icon: Icon, onClick, size = 'md' }) => {
  const sizes = {
    sm: { py: 6,  px: 10, fs: 12 },
    md: { py: 9,  px: 14, fs: 13 },
    lg: { py: 11, px: 18, fs: 14 },
  }[size];
  const styles = {
    primary:   { bg: T.red,    fg: T.paper, bd: T.red,    hover: T.redDark },
    secondary: { bg: T.paper,  fg: T.ink,   bd: T.ink2,   hover: T.surface },
    ghost:     { bg: 'transparent', fg: T.ink2, bd: T.rule, hover: T.surface },
  }[variant];
  return (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: `${sizes.py}px ${sizes.px}px`,
        background: styles.bg, color: styles.fg, border: `1px solid ${styles.bd}`,
        fontSize: sizes.fs, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
        cursor: 'pointer', borderRadius: 4, letterSpacing: 0.1,
        transition: 'background 0.15s, transform 0.05s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = styles.hover}
      onMouseLeave={e => e.currentTarget.style.background = styles.bg}
      onMouseDown={e => e.currentTarget.style.transform = 'translateY(0.5px)'}
      onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {Icon && <Icon size={14} strokeWidth={2.2} />}
      {children}
    </button>
  );
};

const Card = ({ children, padding = 24, style = {} }) => (
  <div style={{
    background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 6,
    padding, ...style,
  }}>{children}</div>
);

const SectionHead = ({ children, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
    <div style={{
      fontSize: 10, color: T.muted, letterSpacing: 2.5, fontWeight: 700,
      fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase',
    }}>{children}</div>
    {action}
  </div>
);

// ───────────────────────────────────────────────────────────
//  PAGE: DASHBOARD
// ───────────────────────────────────────────────────────────
function Dashboard({ goto }) {
  return (
    <div style={{ padding: '32px 36px 60px', maxWidth: 1400 }}>
      {/* Hero strip */}
      <div style={{
        marginBottom: 32, padding: '28px 32px', background: T.ink, color: T.paper,
        borderRadius: 6, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40, width: 220, height: 220,
          background: `radial-gradient(circle, ${T.red}22 0%, transparent 70%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 10, letterSpacing: 2.5, color: T.red, fontWeight: 700,
            fontFamily: 'Manrope', marginBottom: 8,
          }}>WELCOME BACK, MAYA</div>
          <div style={{
            fontFamily: 'Instrument Serif', fontSize: 28, lineHeight: 1.2,
            fontWeight: 400, letterSpacing: -0.5, maxWidth: 700, marginBottom: 12,
          }}>You have <em style={{ color: T.red, fontStyle: 'italic' }}>3 findings</em> awaiting review and <em style={{ color: T.red, fontStyle: 'italic' }}>1 audit</em> ready to close.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => goto('findings')} style={{
              background: T.red, color: T.paper, border: 'none', padding: '8px 14px',
              fontSize: 12, fontWeight: 600, fontFamily: 'Manrope', cursor: 'pointer',
              borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>Review findings <ArrowRight size={13} /></button>
            <button onClick={() => goto('audits')} style={{
              background: 'transparent', color: T.paper, border: `1px solid #444`, padding: '8px 14px',
              fontSize: 12, fontWeight: 600, fontFamily: 'Manrope', cursor: 'pointer', borderRadius: 4,
            }}>View all audits</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {KPIS.map((k, i) => (
          <div key={i} style={{
            background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 6,
            padding: '20px 22px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: k.accent }} />
            <div style={{
              fontSize: 10, color: T.muted, letterSpacing: 2, fontWeight: 600,
              fontFamily: 'Manrope', marginBottom: 12, textTransform: 'uppercase',
            }}>{k.label}</div>
            <div style={{
              fontFamily: 'Instrument Serif', fontSize: 38, fontWeight: 400,
              color: T.ink, letterSpacing: -1, lineHeight: 1, marginBottom: 6,
            }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: T.ink3, fontFamily: 'Manrope' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two-col: Active audits + Live monitor stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <Card padding={0}>
          <div style={{ padding: '20px 24px 12px', borderBottom: `1px solid ${T.ruleSoft}` }}>
            <SectionHead action={<button onClick={() => goto('audits')} style={{
              fontSize: 11, color: T.red, background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Manrope', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>View all <ChevronRight size={12} /></button>}>Recent audits</SectionHead>
          </div>
          <div>
            {RECENT_AUDITS.slice(0, 5).map((a, i) => (
              <div key={a.id} onClick={() => goto('audit-detail')} style={{
                padding: '14px 24px', borderBottom: i < 4 ? `1px solid ${T.ruleSoft}` : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = T.surface}
                onMouseLeave={e => e.currentTarget.style.background = T.paper}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Manrope', fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 0.5 }}>{a.id}</span>
                    <Badge tone="neutral" size="xs">{a.framework}</Badge>
                  </div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginTop: 3 }}>{a.owner} · started {a.started}</div>
                </div>
                <div style={{ width: 100, textAlign: 'right' }}>
                  <StatusPill status={a.status} />
                  <div style={{ marginTop: 6, height: 3, background: T.ruleSoft, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${a.progress}%`, height: '100%',
                      background: a.status === 'complete' ? T.ok : a.status === 'review' ? T.warn : T.red,
                    }} />
                  </div>
                </div>
                <ChevronRight size={14} color={T.faint} />
              </div>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: '20px 24px 12px', borderBottom: `1px solid ${T.ruleSoft}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <SectionHead>Live monitor stream</SectionHead>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10,
              color: T.red, fontFamily: 'Manrope', fontWeight: 600,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: T.red,
                animation: 'pulse 1.4s ease-in-out infinite',
              }} />
              LIVE
            </span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {MONITOR_EVENTS.map((e, i) => (
              <div key={i} style={{
                padding: '12px 24px', borderBottom: i < MONITOR_EVENTS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <SevDot sev={e.sev} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{e.monitor}</span><span>{e.time}</span>
                  </div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, lineHeight: 1.4 }}>{e.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: KNOWLEDGE
// ───────────────────────────────────────────────────────────
function Knowledge() {
  const [hoverId, setHoverId] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 560, lineHeight: 1.55, margin: 0 }}>
          Upload policies, standards, regulations, and frameworks. The platform parses, indexes, and auto-generates testable audit rules — auditor approves before promotion.
        </p>
        <Button icon={Upload} onClick={() => setShowUpload(true)}>Upload document</Button>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'Documents indexed', v: '147' },
          { l: 'Total pages',       v: '8,924' },
          { l: 'Rules generated',   v: '2,103' },
          { l: 'Frameworks covered',v: '12' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '16px 20px', border: `1px solid ${T.rule}`, borderRadius: 6,
            background: T.paper,
          }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 600, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, color: T.ink, letterSpacing: -0.5 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Document list */}
      <Card padding={0}>
        <div style={{ padding: '14px 24px', borderBottom: `1px solid ${T.ruleSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4, flex: 1, maxWidth: 320,
          }}>
            <Search size={14} color={T.muted} />
            <input placeholder="Search documents..." style={{
              border: 'none', background: 'transparent', fontSize: 12.5, outline: 'none',
              fontFamily: 'Manrope', width: '100%', color: T.ink,
            }} />
          </div>
          <Button variant="ghost" icon={Filter} size="sm">Type: All</Button>
          <Button variant="ghost" icon={Filter} size="sm">Status: All</Button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 130px 80px 130px 110px 90px 32px',
          padding: '10px 24px', borderBottom: `1px solid ${T.ruleSoft}`,
          fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope',
          textTransform: 'uppercase', gap: 16,
        }}>
          <span>Document</span><span>Type</span><span>Pages</span><span>Ingested</span><span>Rules</span><span>Status</span><span></span>
        </div>

        {KNOWLEDGE.map((k, i) => (
          <div key={k.id} onMouseEnter={() => setHoverId(k.id)} onMouseLeave={() => setHoverId(null)} style={{
            display: 'grid', gridTemplateColumns: '1fr 130px 80px 130px 110px 90px 32px',
            padding: '16px 24px', borderBottom: i < KNOWLEDGE.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', cursor: 'pointer',
            background: hoverId === k.id ? T.surface : T.paper, transition: 'background 0.12s', gap: 16,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink, fontWeight: 600, marginBottom: 3 }}>{k.title}</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>{k.id}</div>
            </div>
            <Badge tone="neutral" size="xs">{k.type}</Badge>
            <span style={{ fontSize: 12.5, color: T.ink2, fontFamily: 'Manrope' }}>{k.pages}</span>
            <span style={{ fontSize: 12.5, color: T.ink2, fontFamily: 'Manrope' }}>{k.ingested}</span>
            <span style={{ fontSize: 12.5, color: T.ink, fontFamily: 'Manrope', fontWeight: 600 }}>
              {k.status === 'processing' ? <span style={{ color: T.warn }}>parsing…</span> : k.rules}
            </span>
            <StatusPill status={k.status} />
            <ChevronRight size={14} color={T.faint} />
            {k.status === 'processing' && (
              <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10.5, color: T.warn, fontFamily: 'Manrope', fontWeight: 600 }}>
                    Extracting controls · page {Math.round(k.pages * k.progress / 100)} of {k.pages}
                  </span>
                  <span style={{ fontSize: 10.5, color: T.muted, fontFamily: 'Manrope' }}>{k.progress}%</span>
                </div>
                <div style={{ height: 3, background: T.ruleSoft, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${k.progress}%`, height: '100%', background: T.warn,
                    transition: 'width 0.4s' }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </Card>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}

function UploadModal({ onClose }) {
  const [stage, setStage] = useState(0); // 0=upload, 1=parsing, 2=extracting, 3=done
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage === 0) return;
    if (stage >= 3) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setStage(s => s + 1);
          return 0;
        }
        return p + (stage === 1 ? 8 : 5);
      });
    }, 120);
    return () => clearInterval(id);
  }, [stage]);

  const stages = [
    { label: 'Ready to upload',   icon: Upload },
    { label: 'Parsing document',  icon: ScanLine },
    { label: 'Extracting controls',icon: Brain },
    { label: 'Rules generated',   icon: Check },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.paper, borderRadius: 8, width: 540, maxWidth: '92vw',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: T.red, letterSpacing: 2, fontWeight: 700, fontFamily: 'Manrope', marginBottom: 6 }}>UPLOAD KNOWLEDGE</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: T.ink, letterSpacing: -0.4 }}>Ingest a document</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted }}><X size={18} /></button>
        </div>

        <div style={{ padding: 28 }}>
          {stage === 0 ? (
            <div onClick={() => setStage(1)} style={{
              border: `2px dashed ${T.rule}`, borderRadius: 6, padding: '40px 20px',
              textAlign: 'center', cursor: 'pointer', transition: 'border 0.15s, background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.border = `2px dashed ${T.red}`; e.currentTarget.style.background = T.redTint; }}
              onMouseLeave={e => { e.currentTarget.style.border = `2px dashed ${T.rule}`; e.currentTarget.style.background = T.paper; }}>
              <Upload size={28} color={T.muted} style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'Manrope', fontSize: 14, color: T.ink, fontWeight: 600, marginBottom: 4 }}>
                Drop a document or click to browse
              </div>
              <div style={{ fontSize: 12, color: T.muted, fontFamily: 'Manrope' }}>
                PDF, DOCX, HTML · Policies, regulations, standards, frameworks
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600 }}>NIST_CSF_2.0_full.pdf</div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginTop: 3 }}>47 pages · 2.4 MB</div>
              </div>
              {stages.map((s, i) => {
                const Icon = s.icon;
                const done = i < stage;
                const active = i === stage;
                const pending = i > stage;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                    borderBottom: i < stages.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: done ? T.ok : active ? T.red : T.surface,
                      color: done || active ? T.paper : T.muted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: pending ? `1px solid ${T.rule}` : 'none', flexShrink: 0,
                    }}>
                      {done ? <Check size={14} /> : active ? <Loader2 size={14} className="spin" /> : <Icon size={13} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: pending ? T.muted : T.ink, fontWeight: active ? 600 : 500 }}>
                        {s.label}
                      </div>
                      {active && (
                        <div style={{ marginTop: 6, height: 3, background: T.ruleSoft, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: T.red, transition: 'width 0.1s' }} />
                        </div>
                      )}
                      {done && i === 2 && (
                        <div style={{ fontSize: 11.5, color: T.ok, fontFamily: 'Manrope', marginTop: 3 }}>
                          89 testable controls extracted
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {stage >= 3 && (
                <div style={{ marginTop: 20, padding: 16, background: T.okSoft, borderRadius: 4, border: `1px solid #BFE3D2` }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Check size={16} color={T.ok} style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600, marginBottom: 4 }}>89 audit rules ready for your review</div>
                      <div style={{ fontSize: 11.5, color: T.ink2, fontFamily: 'Manrope', lineHeight: 1.5 }}>
                        Auditor approval required before rules go live in continuous monitoring.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 28px', borderTop: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: T.surface }}>
          <Button variant="ghost" onClick={onClose}>{stage >= 3 ? 'Close' : 'Cancel'}</Button>
          {stage >= 3 && <Button>Review rules</Button>}
        </div>
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: RULES
// ───────────────────────────────────────────────────────────
function Rules() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 560, lineHeight: 1.55, margin: 0 }}>
          Audit rules auto-generated from your knowledge library, plus rules you've authored manually. Each rule cites its source.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon={Filter}>Filter</Button>
          <Button icon={Plus}>Author rule</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 1fr 180px 90px 110px 110px',
          padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`,
          fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope',
          textTransform: 'uppercase', gap: 16,
        }}>
          <span>ID</span><span>Rule</span><span>Source</span><span>Severity</span><span>Status</span><span>Last run</span>
        </div>
        {RULES.map((r, i) => (
          <div key={r.id} onClick={() => setSelected(r)} style={{
            display: 'grid', gridTemplateColumns: '90px 1fr 180px 90px 110px 110px',
            padding: '14px 24px', borderBottom: i < RULES.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', cursor: 'pointer', gap: 16,
            transition: 'background 0.12s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, fontWeight: 600 }}>{r.id}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 500 }}>{r.title}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.ink2 }}>
              <span style={{ color: T.red, fontWeight: 600 }}>↳</span> {r.source}
            </span>
            <span><Badge tone={r.severity === 'critical' ? 'red' : r.severity === 'high' ? 'warn' : 'neutral'} size="xs">{r.severity}</Badge></span>
            <StatusPill status={r.status} />
            <span style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Manrope' }}>{r.lastRun}</span>
          </div>
        ))}
      </Card>

      {selected && <RuleDrawer rule={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RuleDrawer({ rule, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 80, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 560, maxWidth: '92vw', background: T.paper, height: '100vh',
        overflowY: 'auto', boxShadow: '-20px 0 50px rgba(0,0,0,0.15)',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, color: T.red, letterSpacing: 2, fontWeight: 700, fontFamily: 'Manrope', marginBottom: 6 }}>RULE · {rule.id}</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: T.ink, letterSpacing: -0.4, lineHeight: 1.25 }}>{rule.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, marginLeft: 16 }}><X size={20} /></button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {[
              ['Source',   rule.source],
              ['Severity', rule.severity],
              ['Status',   rule.status],
              ['Last run', rule.lastRun],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink }}>{v}</div>
              </div>
            ))}
          </div>

          <SectionHead>Logic</SectionHead>
          <div style={{
            background: T.ink, color: '#E5E5E5', padding: 16, borderRadius: 4,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12, lineHeight: 1.6, marginBottom: 24,
          }}>
            <div><span style={{ color: '#F87171' }}>FOR EACH</span> account <span style={{ color: '#F87171' }}>IN</span> iam.privileged_accounts:</div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: '#F87171' }}>ASSERT</span> account.mfa_enabled <span style={{ color: '#F87171' }}>=</span> <span style={{ color: '#A7F3D0' }}>true</span></div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: '#F87171' }}>ASSERT</span> account.last_mfa_check <span style={{ color: '#F87171' }}>{`>`}</span> now() <span style={{ color: '#F87171' }}>-</span> <span style={{ color: '#A7F3D0' }}>30d</span></div>
            <div style={{ paddingLeft: 16, color: '#737373', marginTop: 8 }}>// Source: NIST CSF PR.AC-1, Internal PAM Policy v3.2 §4.1</div>
          </div>

          <SectionHead>Citation chain</SectionHead>
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, marginBottom: 24 }}>
            {[
              { src: 'NIST CSF 2.0', loc: 'PR.AC-1', txt: 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users, and processes.' },
              { src: 'Internal PAM Policy v3.2', loc: '§4.1', txt: 'All privileged accounts must enforce multi-factor authentication with no exceptions for service accounts.' },
            ].map((c, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i === 0 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink, fontWeight: 600 }}>{c.src}</span>
                  <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.red, fontWeight: 600 }}>{c.loc}</span>
                </div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 13, color: T.ink2, fontStyle: 'italic', lineHeight: 1.55 }}>"{c.txt}"</div>
                <button style={{ marginTop: 6, background: 'none', border: 'none', color: T.red, fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  View in document <ExternalLink size={11} />
                </button>
              </div>
            ))}
          </div>

          <SectionHead>Coverage</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
            {['12,847 accounts evaluated', '47 systems in scope', 'Last 30 days'].map((c, i) => (
              <div key={i} style={{ padding: '10px 12px', background: T.surface, borderRadius: 4, fontSize: 11.5, fontFamily: 'Manrope', color: T.ink2, fontWeight: 500 }}>{c}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button>Run now</Button>
            <Button variant="secondary">Edit rule</Button>
            <Button variant="ghost">Disable</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: CONNECTORS
// ───────────────────────────────────────────────────────────
function Connectors() {
  const grouped = CONNECTORS.reduce((acc, c) => {
    (acc[c.cat] = acc[c.cat] || []).push(c);
    return acc;
  }, {});
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 620, lineHeight: 1.55, margin: '0 0 32px' }}>
        Connect data sources, tools, and knowledge systems. Agents query these directly when running audits — no more manual evidence collection.
      </p>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <SectionHead action={
            <span style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>
              {items.filter(i => i.status === 'connected').length} of {items.length} connected
            </span>
          }>{cat}</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {items.map(c => (
              <div key={c.name} style={{
                padding: 18, border: `1px solid ${T.rule}`, borderRadius: 6,
                background: T.paper, display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', transition: 'border 0.12s, transform 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${T.ink}`; }}
                onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${T.rule}`; }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 6, background: c.color,
                  color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                  <StatusPill status={c.status} />
                </div>
                {c.status === 'available' && <Plus size={16} color={T.muted} />}
                {c.status === 'connected' && <Check size={16} color={T.ok} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: AUDITS LIST
// ───────────────────────────────────────────────────────────
function Audits({ goto }) {
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 560, lineHeight: 1.55, margin: 0 }}>
          All audits running across the platform. Trigger one manually or let continuous monitoring fire them on events.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon={Calendar}>Schedule</Button>
          <Button icon={PlayCircle}>Run audit</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 130px 110px 130px 90px 120px', padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`, fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', gap: 16 }}>
          <span>ID</span><span>Audit</span><span>Owner</span><span>Framework</span><span>Status</span><span>Progress</span><span>Started</span>
        </div>
        {RECENT_AUDITS.map((a, i) => (
          <div key={a.id} onClick={() => goto('audit-detail')} style={{
            display: 'grid', gridTemplateColumns: '110px 1fr 130px 110px 130px 90px 120px',
            padding: '16px 24px', borderBottom: i < RECENT_AUDITS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', cursor: 'pointer', gap: 16, transition: 'background 0.12s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, fontWeight: 600 }}>{a.id}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{a.name}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{a.owner}</span>
            <Badge tone="neutral" size="xs">{a.framework}</Badge>
            <StatusPill status={a.status} />
            <div>
              <div style={{ fontSize: 11, color: T.ink2, fontFamily: 'Manrope', marginBottom: 4, fontWeight: 600 }}>{a.progress}%</div>
              <div style={{ height: 3, background: T.ruleSoft, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${a.progress}%`, height: '100%', background: a.status === 'complete' ? T.ok : a.status === 'review' ? T.warn : T.red }} />
              </div>
            </div>
            <span style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Manrope' }}>{a.started}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: AUDIT DETAIL (live execution)
// ───────────────────────────────────────────────────────────
function AuditDetail({ goto }) {
  const [eventCount, setEventCount] = useState(7);
  useEffect(() => {
    const id = setInterval(() => {
      setEventCount(c => Math.min(c + 1, AGENT_TIMELINE.length));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const audit = RECENT_AUDITS[0];
  const visibleTimeline = AGENT_TIMELINE.slice(0, eventCount);

  return (
    <div style={{ padding: '24px 36px 60px' }}>
      <button onClick={() => goto('audits')} style={{
        background: 'none', border: 'none', color: T.muted, cursor: 'pointer',
        fontFamily: 'Manrope', fontSize: 12, marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 4,
      }}><ChevronLeft size={14} /> Back to audits</button>

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'Manrope', fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700 }}>{audit.id}</span>
            <Badge tone="neutral" size="xs">{audit.framework}</Badge>
            <StatusPill status={audit.status} />
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 30, color: T.ink, letterSpacing: -0.6, margin: 0, lineHeight: 1.15, marginBottom: 8 }}>{audit.name}</h2>
          <div style={{ fontSize: 12.5, color: T.ink3, fontFamily: 'Manrope' }}>
            Owner: <strong style={{ color: T.ink }}>{audit.owner}</strong> · Started {audit.started} · Triggered manually
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary">Pause</Button>
          <Button variant="ghost">Abort</Button>
        </div>
      </div>

      {/* Progress strip */}
      <Card padding={20} style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {[
            { l: 'Controls in scope', v: '47' },
            { l: 'Tested',            v: '30' },
            { l: 'Pass',              v: '24', c: T.ok },
            { l: 'Fail',              v: '4',  c: T.bad },
            { l: 'Open findings',     v: '2',  c: T.warn },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 6 }}>{s.l}</div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, color: s.c || T.ink, letterSpacing: -0.5 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, height: 4, background: T.ruleSoft, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${audit.progress}%`, height: '100%', background: T.red, transition: 'width 0.4s' }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>
          {audit.progress}% complete · est. 38 min remaining
        </div>
      </Card>

      {/* Two col: agent timeline + agents working */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <Card padding={0}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.ruleSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionHead>Agent execution timeline</SectionHead>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.red, fontFamily: 'Manrope', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red, animation: 'pulse 1.4s ease-in-out infinite' }} />
              LIVE
            </span>
          </div>
          <div style={{ padding: '0 24px' }}>
            {visibleTimeline.map((e, i) => {
              const isLast = i === visibleTimeline.length - 1;
              return (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < visibleTimeline.length - 1 ? `1px solid ${T.ruleSoft}` : 'none', position: 'relative' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: e.status === 'done' ? T.ok : e.status === 'running' ? T.red : e.status === 'flag' ? T.warn : T.surface,
                    color: e.status === 'queued' ? T.muted : T.paper,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: e.status === 'queued' ? `1px solid ${T.rule}` : 'none', marginTop: 2,
                  }}>
                    {e.status === 'done' && <Check size={12} />}
                    {e.status === 'running' && <Loader2 size={12} className="spin" />}
                    {e.status === 'flag' && <AlertTriangle size={12} />}
                    {e.status === 'queued' && <Clock size={12} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, gap: 10 }}>
                      <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{e.agent}</span>
                      <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 10.5, color: T.muted }}>{e.t}</span>
                    </div>
                    <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink2, lineHeight: 1.5 }}>{e.action}</div>
                  </div>
                </div>
              );
            })}
            {eventCount < AGENT_TIMELINE.length && (
              <div style={{ padding: '14px 0', textAlign: 'center', color: T.muted, fontFamily: 'Manrope', fontSize: 11 }}>
                <Loader2 size={12} className="spin" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Agents executing…
              </div>
            )}
          </div>
        </Card>

        <div>
          <Card padding={0} style={{ marginBottom: 16 }}>
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${T.ruleSoft}` }}>
              <SectionHead>Active agents</SectionHead>
            </div>
            {[
              { n: 'Orchestrator',      i: 'O',  c: T.ink,  s: 'planning'   },
              { n: 'Evidence Collector',i: 'EC', c: '#3B82F6', s: 'idle'    },
              { n: 'Rule Executor',     i: 'RE', c: '#0891B2', s: 'running' },
              { n: 'Anomaly Detector',  i: 'AD', c: '#7C3AED', s: 'running' },
              { n: 'Narrative Drafter', i: 'ND', c: T.red,    s: 'running' },
              { n: 'Citation Validator',i: 'CV', c: T.warn,   s: 'queued'  },
            ].map((a, i, arr) => (
              <div key={a.n} style={{ padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, background: a.c, color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 11 }}>{a.i}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{a.n}</div>
                  <div style={{ fontSize: 11, color: a.s === 'running' ? T.red : a.s === 'queued' ? T.warn : T.muted, fontFamily: 'Manrope', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    {a.s === 'running' && <Loader2 size={10} className="spin" />}
                    {a.s}
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <Card padding={20}>
            <SectionHead>New findings</SectionHead>
            {FINDINGS.slice(0, 2).map((f, i, arr) => (
              <div key={f.id} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <SevDot sev={f.severity} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600, lineHeight: 1.4 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginTop: 3 }}>{f.id} · just now</div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: FINDINGS
// ───────────────────────────────────────────────────────────
function Findings() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 560, lineHeight: 1.55, margin: '0 0 28px' }}>
        Every finding traces back to source evidence and the policy text that defined the control. No claim without a citation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'Critical', v: '4',  c: T.red },
          { l: 'High',     v: '11', c: T.warn },
          { l: 'Medium',   v: '6',  c: '#3B82F6' },
          { l: 'Low',      v: '2',  c: T.muted },
        ].map((s, i) => (
          <div key={i} style={{ padding: '16px 20px', border: `1px solid ${T.rule}`, borderRadius: 6, background: T.paper, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: s.c }} />
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 30, color: T.ink, letterSpacing: -0.6, lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 200px 130px 130px 80px', padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`, fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', gap: 16 }}>
          <span>ID</span><span>Finding</span><span>Audit</span><span>Owner</span><span>Status</span><span>Age</span>
        </div>
        {FINDINGS.map((f, i) => (
          <div key={f.id} onClick={() => setOpen(f)} style={{
            display: 'grid', gridTemplateColumns: '90px 1fr 200px 130px 130px 80px',
            padding: '16px 24px', borderBottom: i < FINDINGS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', cursor: 'pointer', gap: 16, transition: 'background 0.12s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, fontWeight: 600 }}>{f.id}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SevDot sev={f.severity} />
              <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600 }}>{f.title}</span>
            </div>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{f.audit}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{f.owner}</span>
            <StatusPill status={f.status} />
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>{f.age}</span>
          </div>
        ))}
      </Card>

      {open && <FindingDrawer finding={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function FindingDrawer({ finding, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 80, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 640, maxWidth: '94vw', background: T.paper, height: '100vh', overflowY: 'auto', boxShadow: '-20px 0 50px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: 'Manrope', fontSize: 10, color: T.red, letterSpacing: 2, fontWeight: 700 }}>FINDING · {finding.id}</span>
              <Badge tone={finding.severity === 'critical' ? 'red' : 'warn'} size="xs">{finding.severity}</Badge>
            </div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: T.ink, letterSpacing: -0.4, lineHeight: 1.25 }}>{finding.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, marginLeft: 16 }}><X size={20} /></button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
            {[['Audit', finding.audit], ['Owner', finding.owner], ['Age', finding.age]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink }}>{v}</div>
              </div>
            ))}
          </div>

          <SectionHead>AI-generated summary</SectionHead>
          <div style={{ background: T.surface, padding: 18, borderRadius: 4, marginBottom: 24, border: `1px solid ${T.ruleSoft}` }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <Sparkles size={14} color={T.red} />
              <span style={{ fontSize: 11, color: T.red, fontFamily: 'Manrope', fontWeight: 700, letterSpacing: 1 }}>NARRATIVE DRAFTER</span>
            </div>
            <p style={{ fontFamily: 'Instrument Serif', fontSize: 15, color: T.ink, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              "User <strong style={{ fontStyle: 'normal' }}>j.malik@bank.com</strong> holds the privileged role <strong style={{ fontStyle: 'normal' }}>aws-prod-admin</strong> in account <strong style={{ fontStyle: 'normal' }}>123456789012</strong> (US-East-1). MFA was not enforced at the IAM identity center, in violation of internal PAM policy §4.1 and NIST CSF PR.AC-1. The account has been active since 2024-11-03 with elevated permissions across 14 production resources."
            </p>
          </div>

          <SectionHead>Citation chain</SectionHead>
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, marginBottom: 24 }}>
            {[
              { type: 'Policy',   title: 'Internal PAM Policy v3.2',   loc: 'Section 4.1',         hint: 'Required control: MFA on privileged accounts' },
              { type: 'Standard', title: 'NIST CSF 2.0',                loc: 'Subcategory PR.AC-1', hint: 'Underlying framework requirement' },
              { type: 'Evidence', title: 'AWS IAM export · 2026-05-22', loc: 'identity_store_d-abc', hint: 'Account state at time of detection' },
              { type: 'Evidence', title: 'CloudTrail · last 30d',       loc: 'ConsoleLogin events',  hint: '47 logins observed without MFA challenge' },
            ].map((c, i, arr) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge tone={c.type === 'Evidence' ? 'red' : 'neutral'} size="xs">{c.type}</Badge>
                    <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{c.title}</span>
                  </div>
                  <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11, color: T.muted }}>{c.loc}</span>
                </div>
                <div style={{ fontSize: 11.5, color: T.ink3, fontFamily: 'Manrope', marginBottom: 6 }}>{c.hint}</div>
                <button style={{ background: 'none', border: 'none', color: T.red, fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  View source <ExternalLink size={11} />
                </button>
              </div>
            ))}
          </div>

          <SectionHead>Recommended remediation</SectionHead>
          <div style={{ padding: 18, background: T.redTint, borderRadius: 4, marginBottom: 24, border: `1px solid #F8C8C5` }}>
            <ol style={{ margin: 0, paddingLeft: 20, fontFamily: 'Manrope', fontSize: 13, color: T.ink2, lineHeight: 1.7 }}>
              <li>Enforce MFA on the IAM identity center for all privileged roles via SCP.</li>
              <li>Suspend the account until MFA registration is complete.</li>
              <li>Backfill MFA enrollment status check in continuous monitor R-2451.</li>
              <li>Open ticket with CloudOps for resolution within 24h.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button>Open ticket in Jira</Button>
            <Button variant="secondary">Mark in remediation</Button>
            <Button variant="ghost">Dismiss</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  PAGE: MONITORING
// ───────────────────────────────────────────────────────────
function Monitoring() {
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: 0 }}>
          Always-on monitors react to events across the estate. When a monitor fires, the platform spins up an agent run automatically.
        </p>
        <Button icon={Plus}>New monitor</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <Card padding={0}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.ruleSoft}` }}>
            <SectionHead>Active monitors</SectionHead>
          </div>
          {MONITORS.map((m, i) => (
            <div key={m.name} style={{
              padding: '16px 24px', borderBottom: i < MONITORS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
              display: 'grid', gridTemplateColumns: '1fr 90px 90px', gap: 16, alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Manrope' }}>
                  Scope: {m.scope} · Trigger: <strong style={{ color: T.ink2 }}>{m.trigger}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, fontFamily: 'Manrope', fontWeight: 600, marginBottom: 2 }}>WINDOW</div>
                <div style={{ fontSize: 11.5, color: T.ink, fontFamily: 'Manrope', fontWeight: 600 }}>{m.window}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, fontFamily: 'Manrope', fontWeight: 600, marginBottom: 2 }}>24H</div>
                <div style={{
                  fontFamily: 'Instrument Serif', fontSize: 22,
                  color: m.alerts24h > 5 ? T.red : m.alerts24h > 0 ? T.warn : T.muted,
                  letterSpacing: -0.5,
                }}>{m.alerts24h}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card padding={0}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.ruleSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionHead>Recent triggers</SectionHead>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.red, fontFamily: 'Manrope', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red, animation: 'pulse 1.4s ease-in-out infinite' }} />
              LIVE
            </span>
          </div>
          {MONITOR_EVENTS.map((e, i) => (
            <div key={i} style={{ padding: '14px 24px', borderBottom: i < MONITOR_EVENTS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <SevDot sev={e.sev} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>{e.monitor}</span>
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>{e.time}</span>
                  </div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, lineHeight: 1.4 }}>{e.msg}</div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN: MOCK DATA
// ───────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: 'agt-orch',  name: 'Orchestrator',        role: 'Coordinator',
    desc: 'Plans audits, decomposes work into tasks, dispatches to specialists, synthesizes results into final workpapers.',
    model: 'claude-opus-4-7', status: 'healthy',  runs24h: 142, successRate: 99.3, avgLatency: '4.2s',
    cost24h: '$28.40', tools: ['planning_engine', 'task_dispatcher', 'result_synthesizer'],
    color: T.ink, icon: 'O', maxConcurrent: 8, timeout: '15m',
  },
  {
    id: 'agt-evcol', name: 'Evidence Collector',  role: 'Data fetcher',
    desc: 'Pulls evidence from connected source systems via API and RPA. Normalizes into common schema before handing off to other agents.',
    model: 'claude-sonnet-4-6', status: 'healthy', runs24h: 487, successRate: 98.7, avgLatency: '8.1s',
    cost24h: '$41.20', tools: ['okta_api', 'sap_api', 'aws_api', 'snow_api', 'rpa_runner'],
    color: '#3B82F6', icon: 'EC', maxConcurrent: 16, timeout: '5m',
  },
  {
    id: 'agt-rule',  name: 'Rule Executor',       role: 'Testing engine',
    desc: 'Runs audit rules against collected evidence. Tags pass/fail with full reasoning trace for every assertion.',
    model: 'claude-sonnet-4-6', status: 'healthy', runs24h: 1247, successRate: 99.8, avgLatency: '1.4s',
    cost24h: '$62.80', tools: ['rule_engine', 'sql_executor', 'graph_query'],
    color: '#0891B2', icon: 'RE', maxConcurrent: 32, timeout: '2m',
  },
  {
    id: 'agt-anom',  name: 'Anomaly Detector',    role: 'ML analyst',
    desc: 'Unsupervised ML on transactions, access patterns, and change tickets. Clusters and ranks outliers for review.',
    model: 'isolation-forest + claude-sonnet-4-6', status: 'degraded', runs24h: 89, successRate: 96.2, avgLatency: '12.7s',
    cost24h: '$18.90', tools: ['ml_pipeline', 'feature_store', 'cluster_analyzer'],
    color: '#7C3AED', icon: 'AD', maxConcurrent: 4, timeout: '20m',
  },
  {
    id: 'agt-narr',  name: 'Narrative Drafter',   role: 'Writer',
    desc: 'Generates walkthrough memos, deficiency write-ups, and finding narratives in PCAOB-ready format with full citations.',
    model: 'claude-opus-4-7', status: 'healthy',  runs24h: 312, successRate: 99.0, avgLatency: '6.8s',
    cost24h: '$54.30', tools: ['template_engine', 'citation_resolver', 'pcaob_validator'],
    color: T.red, icon: 'ND', maxConcurrent: 12, timeout: '10m',
  },
  {
    id: 'agt-cite',  name: 'Citation Validator',  role: 'Verifier',
    desc: 'Confirms every claim ties back to a source document with timestamp. Blocks any output containing unverified assertions.',
    model: 'claude-sonnet-4-6', status: 'healthy', runs24h: 287, successRate: 99.9, avgLatency: '2.1s',
    cost24h: '$11.40', tools: ['citation_index', 'source_resolver', 'hash_verifier'],
    color: T.warn, icon: 'CV', maxConcurrent: 24, timeout: '3m',
  },
  {
    id: 'agt-remed', name: 'Remediation Tracker', role: 'Workflow runner',
    desc: 'Opens tickets in Jira/ServiceNow, monitors closure SLAs, escalates aged items to control owners and risk committee.',
    model: 'claude-haiku-4-5', status: 'healthy',  runs24h: 156, successRate: 99.6, avgLatency: '1.8s',
    cost24h: '$3.20', tools: ['jira_api', 'snow_api', 'slack_api', 'sla_monitor'],
    color: T.ok, icon: 'RT', maxConcurrent: 16, timeout: '2m',
  },
];

const MODELS = [
  { name: 'claude-opus-4-7',   provider: 'Anthropic', tier: 'Primary reasoning',  status: 'active',  cost1k: '$15/$75', latencyP50: '1.8s', usedBy: 2, callsToday: '12.4k' },
  { name: 'claude-sonnet-4-6', provider: 'Anthropic', tier: 'General purpose',    status: 'active',  cost1k: '$3/$15',  latencyP50: '0.9s', usedBy: 3, callsToday: '47.2k' },
  { name: 'claude-haiku-4-5',  provider: 'Anthropic', tier: 'Fast & cheap',       status: 'active',  cost1k: '$0.25/$1.25',latencyP50: '0.3s',usedBy: 1,callsToday: '89.7k' },
  { name: 'gpt-4o',            provider: 'OpenAI',    tier: 'Fallback',           status: 'standby', cost1k: '$5/$15',  latencyP50: '1.2s', usedBy: 0, callsToday: '0' },
  { name: 'isolation-forest',  provider: 'Internal',  tier: 'ML — anomalies',     status: 'active',  cost1k: '—',       latencyP50: '0.05s',usedBy: 1, callsToday: '4.1k' },
];

const PROMPTS = [
  { id: 'PR-Orch-001',  name: 'Orchestrator · planning',         agent: 'Orchestrator',      version: 'v12', author: 'M. Chen',    updated: '3d ago',  status: 'production' },
  { id: 'PR-Narr-014',  name: 'Narrative · finding draft',       agent: 'Narrative Drafter', version: 'v23', author: 'R. Patel',   updated: '1d ago',  status: 'production' },
  { id: 'PR-Narr-015',  name: 'Narrative · walkthrough memo',    agent: 'Narrative Drafter', version: 'v18', author: 'R. Patel',   updated: '6d ago',  status: 'production' },
  { id: 'PR-Cite-003',  name: 'Citation · verify claim',         agent: 'Citation Validator',version: 'v9',  author: 'J. Adeyemi', updated: '12d ago', status: 'production' },
  { id: 'PR-Anom-007',  name: 'Anomaly · cluster narrative',     agent: 'Anomaly Detector',  version: 'v5',  author: 'A. Singh',   updated: '2h ago',  status: 'pending review' },
  { id: 'PR-Rule-002',  name: 'Rule · pass/fail explanation',    agent: 'Rule Executor',     version: 'v11', author: 'M. Chen',    updated: '1mo ago', status: 'production' },
];

const USERS = [
  { name: 'Maya Chen',      email: 'maya.chen@bank.com',     role: 'Platform Admin',   teams: ['Internal Audit'],   lastActive: 'now',   mfa: true },
  { name: 'Raj Patel',      email: 'raj.patel@bank.com',     role: 'Senior Auditor',   teams: ['ITGC', 'SOX'],      lastActive: '12m ago',mfa: true },
  { name: 'Jane Adeyemi',   email: 'jane.a@bank.com',        role: 'Senior Auditor',   teams: ['Cyber'],            lastActive: '1h ago', mfa: true },
  { name: 'Anil Singh',     email: 'anil.singh@bank.com',    role: 'Auditor',          teams: ['Finance'],          lastActive: '3h ago', mfa: true },
  { name: 'Sara Kowalski',  email: 'sara.k@bank.com',        role: 'Auditor',          teams: ['Vendor Risk'],      lastActive: '1d ago', mfa: true },
  { name: 'Tom Riley',      email: 'tom.riley@bank.com',     role: 'Control Owner',    teams: ['Finance IT'],       lastActive: '4h ago', mfa: true },
  { name: 'External · BigCo',email:'audit-readonly@bigco.com',role: 'External Auditor', teams: ['Q2 SOX'],           lastActive: '2d ago', mfa: true },
];

const PLATFORM_LOG = [
  { t: '14:04:21', actor: 'Maya Chen',         action: 'Promoted prompt PR-Anom-007 v5 to production',     cat: 'governance' },
  { t: '14:02:11', actor: 'system',            action: 'Orchestrator started audit AUD-2026-114',          cat: 'audit' },
  { t: '13:58:42', actor: 'continuous monitor',action: 'Triggered audit run — IAM privileged drift',       cat: 'audit' },
  { t: '13:45:09', actor: 'Raj Patel',         action: 'Approved 14 new rules from NIST CSF ingest',       cat: 'governance' },
  { t: '13:30:18', actor: 'Maya Chen',         action: 'Connected new source: CrowdStrike',                cat: 'config' },
  { t: '12:51:33', actor: 'system',            action: 'Anomaly Detector model upgraded — v4.1 → v4.2',    cat: 'config' },
  { t: '12:14:07', actor: 'Anil Singh',        action: 'Closed finding F-1822 as remediated',              cat: 'workflow' },
  { t: '11:47:22', actor: 'system',            action: 'Hourly health check: all 7 agents healthy',        cat: 'system' },
  { t: '11:02:55', actor: 'Sara Kowalski',     action: 'Uploaded knowledge: SOC 2 — Acme Cloud Inc.',      cat: 'governance' },
];

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: AI AGENTS
// ───────────────────────────────────────────────────────────
function AdminAgents() {
  const [selected, setSelected] = useState(null);
  const healthy = AGENTS.filter(a => a.status === 'healthy').length;
  const totalRuns = AGENTS.reduce((s, a) => s + a.runs24h, 0);
  const totalCost = AGENTS.reduce((s, a) => s + parseFloat(a.cost24h.replace('$','')), 0);
  const avgSuccess = (AGENTS.reduce((s, a) => s + a.successRate, 0) / AGENTS.length).toFixed(1);

  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: 0 }}>
          Every AI agent on the platform, with its configuration, model assignments, tool access, and live performance metrics. Click any agent for full configuration.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon={History}>Run history</Button>
          <Button icon={Plus}>Register agent</Button>
        </div>
      </div>

      {/* Aggregate metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'Agents',         v: `${healthy}/${AGENTS.length}`, sub: 'healthy',     c: T.ok },
          { l: 'Runs (24h)',     v: totalRuns.toLocaleString(),    sub: 'across estate',c: T.ink },
          { l: 'Success rate',   v: `${avgSuccess}%`,              sub: 'weighted avg', c: T.ok },
          { l: 'Cost (24h)',     v: `$${totalCost.toFixed(0)}`,    sub: 'LLM + ML',     c: T.red },
        ].map((s, i) => (
          <div key={i} style={{ padding: '18px 22px', border: `1px solid ${T.rule}`, borderRadius: 6, background: T.paper, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: s.c }} />
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 32, color: T.ink, letterSpacing: -0.6, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.ink3, fontFamily: 'Manrope' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Agent grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {AGENTS.map(a => (
          <div key={a.id} onClick={() => setSelected(a)} style={{
            background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 6,
            padding: 20, cursor: 'pointer', transition: 'border 0.12s, transform 0.12s',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${T.ink}`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${T.rule}`; e.currentTarget.style.transform = 'translateY(0)'; }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 6, background: a.color,
                color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: 15, fontWeight: 600, color: T.ink }}>{a.name}</span>
                  <StatusPill status={a.status === 'healthy' ? 'active' : 'pending'} />
                </div>
                <div style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Manrope', marginTop: 2 }}>
                  {a.role} · {a.id}
                </div>
              </div>
            </div>

            {/* Desc */}
            <div style={{ fontSize: 12, color: T.ink2, fontFamily: 'Manrope', lineHeight: 1.5, marginBottom: 14, minHeight: 54 }}>
              {a.desc}
            </div>

            {/* Model */}
            <div style={{ padding: '8px 10px', background: T.surface, borderRadius: 4, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Brain size={13} color={T.muted} />
              <span style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>Model</span>
              <span style={{
                fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11,
                color: T.ink, marginLeft: 'auto', fontWeight: 500,
              }}>{a.model}</span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 12, borderTop: `1px solid ${T.ruleSoft}` }}>
              {[
                ['Runs 24h', a.runs24h.toLocaleString()],
                ['Success',  `${a.successRate}%`],
                ['Latency',  a.avgLatency],
                ['Cost 24h', a.cost24h],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9.5, color: T.muted, letterSpacing: 1, fontWeight: 600, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && <AgentDrawer agent={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function AgentDrawer({ agent, onClose }) {
  const [tab, setTab] = useState('config');
  const tabs = [
    { id: 'config',  label: 'Configuration' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'runs',    label: 'Recent runs' },
    { id: 'tools',   label: 'Tools & access' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 80, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 720, maxWidth: '96vw', background: T.paper, height: '100vh', overflowY: 'auto', boxShadow: '-20px 0 50px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 6, background: agent.color,
                color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 16,
              }}>{agent.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: T.red, letterSpacing: 2, fontWeight: 700, fontFamily: 'Manrope', marginBottom: 4 }}>AI AGENT · {agent.id}</div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, color: T.ink, letterSpacing: -0.5, lineHeight: 1.15 }}>{agent.name}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: 'Manrope', marginTop: 4 }}>{agent.role}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted }}><X size={20} /></button>
          </div>
          <div style={{ fontSize: 13, color: T.ink2, fontFamily: 'Manrope', lineHeight: 1.6, maxWidth: 580 }}>
            {agent.desc}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginTop: 20, borderBottom: `1px solid ${T.ruleSoft}`, marginBottom: -1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px',
                fontFamily: 'Manrope', fontSize: 12.5, fontWeight: tab === t.id ? 600 : 500,
                color: tab === t.id ? T.ink : T.muted,
                borderBottom: tab === t.id ? `2px solid ${T.red}` : '2px solid transparent',
                marginRight: 4,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* CONFIG TAB */}
          {tab === 'config' && (
            <div>
              <SectionHead>Model & inference</SectionHead>
              <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, marginBottom: 24 }}>
                {[
                  ['Primary model',    agent.model,                           'change'],
                  ['Fallback model',   'gpt-4o',                              'change'],
                  ['Temperature',      '0.2',                                 'edit'],
                  ['Max tokens',       '4,096',                               'edit'],
                  ['System prompt',    `PR-${agent.name.slice(0,4)}-001 · v12`, 'view'],
                  ['Output schema',    'finding_v2.json',                     'view'],
                ].map(([k, v, action], i, arr) => (
                  <div key={k} style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '160px 1fr 80px', alignItems: 'center', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none', gap: 12 }}>
                    <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>{k}</span>
                    <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12, color: T.ink }}>{v}</span>
                    <button style={{ background: 'none', border: 'none', color: T.red, fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, cursor: 'pointer', justifySelf: 'end' }}>{action}</button>
                  </div>
                ))}
              </div>

              <SectionHead>Execution limits</SectionHead>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  ['Max concurrent', agent.maxConcurrent, 'runs in parallel'],
                  ['Timeout',        agent.timeout,        'per run'],
                  ['Retry policy',   '3× exponential',     'on transient errors'],
                ].map(([k, v, sub]) => (
                  <div key={k} style={{ padding: '14px 16px', background: T.surface, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 6 }}>{k}</div>
                    <div style={{ fontFamily: 'Instrument Serif', fontSize: 20, color: T.ink, letterSpacing: -0.4, marginBottom: 2 }}>{v}</div>
                    <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>{sub}</div>
                  </div>
                ))}
              </div>

              <SectionHead>Guardrails</SectionHead>
              <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4 }}>
                {[
                  ['PII redaction',          'Pre-flight scrub before model call',  true],
                  ['Output validation',      'JSON schema enforcement',             true],
                  ['Citation required',      'Every claim must link to source',     true],
                  ['Cost ceiling per run',   '$2.50 hard cap',                       true],
                  ['Auto-pause on drift',    'If success rate < 95% over 1h',       true],
                ].map(([k, v, on], i, arr) => (
                  <div key={k} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                    <div style={{ width: 28, height: 16, background: on ? T.ok : T.rule, borderRadius: 8, position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 12, height: 12, background: T.paper, borderRadius: '50%', position: 'absolute', top: 2, left: on ? 14 : 2, transition: 'left 0.15s' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginTop: 2 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* METRICS TAB */}
          {tab === 'metrics' && (
            <div>
              <SectionHead>Last 24 hours</SectionHead>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  ['Total runs',     agent.runs24h.toLocaleString(), null],
                  ['Success rate',   `${agent.successRate}%`,        '+0.2% vs 7d'],
                  ['p50 latency',    agent.avgLatency,               '−0.3s vs 7d'],
                  ['Cost',           agent.cost24h,                  '+12% vs 7d'],
                ].map(([k, v, delta]) => (
                  <div key={k} style={{ padding: '16px 18px', border: `1px solid ${T.rule}`, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
                    <div style={{ fontFamily: 'Instrument Serif', fontSize: 26, color: T.ink, letterSpacing: -0.5, lineHeight: 1 }}>{v}</div>
                    {delta && <div style={{ fontSize: 11, color: T.ink3, fontFamily: 'Manrope', marginTop: 6 }}>{delta}</div>}
                  </div>
                ))}
              </div>

              <SectionHead>Run volume — last 7 days</SectionHead>
              <div style={{ padding: 20, border: `1px solid ${T.rule}`, borderRadius: 4, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
                  {[42, 38, 55, 67, 48, 71, agent.runs24h > 200 ? 95 : 62].map((h, i) => {
                    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Today'];
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{
                            width: '100%', height: `${h}%`,
                            background: i === 6 ? T.red : T.ink2,
                            borderRadius: '3px 3px 0 0',
                          }} />
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: 'Manrope', fontWeight: 600 }}>{days[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SectionHead>Failure breakdown</SectionHead>
              <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4 }}>
                {[
                  ['Timeout',                  3, T.warn],
                  ['Upstream API error',       2, T.red],
                  ['Schema validation failed', 1, T.warn],
                  ['Citation missing',         0, T.muted],
                ].map(([k, v, c], i, arr) => (
                  <div key={k} style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 60px 60px', alignItems: 'center', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                      <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink }}>{k}</span>
                    </div>
                    <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                    <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, textAlign: 'right' }}>24h</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RUNS TAB */}
          {tab === 'runs' && (
            <div>
              <SectionHead>Recent invocations</SectionHead>
              <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4 }}>
                {[
                  { t: '14:04:21', audit: 'AUD-2026-114', status: 'success', dur: '3.8s', tokens: '4,210' },
                  { t: '14:03:58', audit: 'AUD-2026-114', status: 'running', dur: '—',    tokens: '—' },
                  { t: '14:01:12', audit: 'AUD-2026-112', status: 'success', dur: '6.1s', tokens: '5,840' },
                  { t: '13:58:42', audit: 'AUD-2026-114', status: 'success', dur: '4.2s', tokens: '3,920' },
                  { t: '13:42:01', audit: 'AUD-2026-112', status: 'success', dur: '5.0s', tokens: '4,610' },
                  { t: '13:30:11', audit: 'AUD-2026-112', status: 'failed',  dur: '15.0s',tokens: '—' },
                  { t: '13:14:55', audit: 'AUD-2026-114', status: 'success', dur: '3.4s', tokens: '3,720' },
                ].map((r, i, arr) => (
                  <div key={i} style={{
                    padding: '12px 16px', display: 'grid',
                    gridTemplateColumns: '90px 1fr 110px 80px 90px', alignItems: 'center', gap: 12,
                    borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
                  }}>
                    <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11, color: T.muted }}>{r.t}</span>
                    <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink, fontWeight: 500 }}>{r.audit}</span>
                    <StatusPill status={r.status === 'success' ? 'complete' : r.status === 'running' ? 'running' : 'open'} />
                    <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.ink2 }}>{r.dur}</span>
                    <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.ink2, textAlign: 'right' }}>{r.tokens} tok</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOOLS TAB */}
          {tab === 'tools' && (
            <div>
              <SectionHead>Tools available to this agent</SectionHead>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
                {agent.tools.map(t => (
                  <div key={t} style={{ padding: '12px 14px', border: `1px solid ${T.rule}`, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Code2 size={14} color={T.red} />
                    <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12, color: T.ink }}>{t}</span>
                    <Check size={13} color={T.ok} style={{ marginLeft: 'auto' }} />
                  </div>
                ))}
              </div>

              <SectionHead>Data access scopes</SectionHead>
              <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4 }}>
                {[
                  ['Evidence lake',       'read',  'all collected evidence'],
                  ['Knowledge base',      'read',  'policies, regs, standards'],
                  ['Rule library',        'read',  'all active rules'],
                  ['Source systems',      'none',  'only via Evidence Collector'],
                  ['Findings store',      agent.name === 'Narrative Drafter' ? 'write' : 'read', agent.name === 'Narrative Drafter' ? 'can draft findings' : 'read-only access'],
                ].map(([k, scope, sub], i, arr) => (
                  <div key={k} style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '180px 80px 1fr', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                    <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 500 }}>{k}</span>
                    <Badge tone={scope === 'write' ? 'red' : scope === 'read' ? 'ok' : 'neutral'} size="xs">{scope}</Badge>
                    <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 28px', borderTop: `1px solid ${T.rule}`, background: T.surface, display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0 }}>
          <Button variant="ghost" icon={Power}>Pause agent</Button>
          <Button variant="secondary" icon={History}>View all runs</Button>
          <Button icon={Pencil}>Edit configuration</Button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: MODELS
// ───────────────────────────────────────────────────────────
function AdminModels() {
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: 0 }}>
          Approved models in the registry. Versioned, monitored for drift, and tracked for cost. Agents can only call models listed here.
        </p>
        <Button icon={Plus}>Register model</Button>
      </div>

      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 160px 100px 130px 110px 90px 70px', padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`, fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', gap: 16 }}>
          <span>Model</span><span>Provider</span><span>Tier</span><span>Status</span><span>Cost /1M tok</span><span>p50 latency</span><span>Used by</span><span>24h</span>
        </div>
        {MODELS.map((m, i) => (
          <div key={m.name} style={{
            display: 'grid', gridTemplateColumns: '1fr 110px 160px 100px 130px 110px 90px 70px',
            padding: '16px 24px', borderBottom: i < MODELS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', gap: 16, transition: 'background 0.12s', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 4, background: T.ink, color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={14} />
              </div>
              <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{m.name}</span>
            </div>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{m.provider}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{m.tier}</span>
            <StatusPill status={m.status === 'active' ? 'active' : 'pending'} />
            <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11.5, color: T.ink2 }}>{m.cost1k}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{m.latencyP50}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink, fontWeight: 600 }}>{m.usedBy} agent{m.usedBy !== 1 ? 's' : ''}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, textAlign: 'right' }}>{m.callsToday}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: PROMPTS
// ───────────────────────────────────────────────────────────
function AdminPrompts() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: 0 }}>
          Versioned prompts under change control. Every promotion to production requires diff review and approval. No prompt edits in flight.
        </p>
        <Button icon={Plus}>New prompt</Button>
      </div>

      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 180px 70px 130px 130px 130px', padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`, fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', gap: 16 }}>
          <span>ID</span><span>Name</span><span>Agent</span><span>Version</span><span>Author</span><span>Updated</span><span>Status</span>
        </div>
        {PROMPTS.map((p, i) => (
          <div key={p.id} onClick={() => setSelected(p)} style={{
            display: 'grid', gridTemplateColumns: '130px 1fr 180px 70px 130px 130px 130px',
            padding: '16px 24px', borderBottom: i < PROMPTS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', gap: 16, transition: 'background 0.12s', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11.5, color: T.muted, fontWeight: 600 }}>{p.id}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600 }}>{p.name}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{p.agent}</span>
            <Badge tone="neutral" size="xs">{p.version}</Badge>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink2 }}>{p.author}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>{p.updated}</span>
            <Badge tone={p.status === 'production' ? 'ok' : 'warn'} size="xs">
              {p.status === 'production' ? '● Production' : '● Pending review'}
            </Badge>
          </div>
        ))}
      </Card>

      {selected && <PromptDrawer prompt={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PromptDrawer({ prompt, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 80, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 720, maxWidth: '96vw', background: T.paper, height: '100vh', overflowY: 'auto', boxShadow: '-20px 0 50px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, color: T.red, letterSpacing: 2, fontWeight: 700, fontFamily: 'Manrope', marginBottom: 6 }}>PROMPT · {prompt.id}</div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 24, color: T.ink, letterSpacing: -0.5, lineHeight: 1.2 }}>{prompt.name}</div>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: 'Manrope', marginTop: 6 }}>
              {prompt.agent} · {prompt.version} · by {prompt.author}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          <SectionHead>System prompt</SectionHead>
          <div style={{
            background: T.ink, color: '#E5E5E5', padding: 18, borderRadius: 4,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12, lineHeight: 1.7, marginBottom: 24,
            whiteSpace: 'pre-wrap', maxHeight: 380, overflowY: 'auto',
          }}>
{`You are an audit narrative drafter operating in a regulated
financial services environment. Your job is to convert
structured audit findings into PCAOB-ready written workpapers.

RULES:
- Every assertion must cite source evidence by document ID.
- Use formal, neutral tone. No hedging language.
- Quantify wherever possible (counts, dates, amounts).
- If evidence is incomplete, state so explicitly — do not
  infer missing facts.
- Output must conform to schema: finding_v2.json

INPUTS:
- finding_data: structured object from Rule Executor
- source_evidence: list of evidence records with hashes
- prior_year_workpapers: optional reference for voice

OUTPUT:
A workpaper memo in markdown with sections:
1. Control description
2. Test approach
3. Results (pass/fail with citations)
4. Deficiency (if any)
5. Recommendation`}
          </div>

          <SectionHead>Version history</SectionHead>
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, marginBottom: 24 }}>
            {[
              ['v23', 'Improved citation format for SOC 2 reports', 'R. Patel', '1d ago',  'production'],
              ['v22', 'Reduced verbosity on remediation section',   'R. Patel', '2w ago',  'archived'],
              ['v21', 'Added schema validation for output',         'M. Chen',  '1mo ago', 'archived'],
              ['v20', 'Initial PCAOB-ready format',                 'M. Chen',  '3mo ago', 'archived'],
            ].map(([v, desc, author, when, status], i, arr) => (
              <div key={v} style={{ padding: '12px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <Badge tone={status === 'production' ? 'ok' : 'neutral'} size="xs">{v}</Badge>
                  <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 500, flex: 1 }}>{desc}</span>
                  <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted }}>{when}</span>
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginLeft: 50 }}>by {author}</div>
              </div>
            ))}
          </div>

          <SectionHead>Evaluation</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              ['Citation accuracy', '99.4%', T.ok],
              ['Schema validity',   '100%',  T.ok],
              ['Auditor approval',  '94.2%', T.ok],
            ].map(([k, v, c]) => (
              <div key={k} style={{ padding: '14px 16px', background: T.surface, borderRadius: 4 }}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', marginBottom: 6 }}>{k}</div>
                <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: c, letterSpacing: -0.4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px 28px', borderTop: `1px solid ${T.rule}`, background: T.surface, display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0 }}>
          <Button variant="ghost">Compare versions</Button>
          <Button variant="secondary">Test in sandbox</Button>
          <Button icon={Pencil}>Edit prompt</Button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: USERS & ROLES
// ───────────────────────────────────────────────────────────
function AdminUsers() {
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: 0 }}>
          Platform users and their roles. Every action is logged; external auditors get read-only scoped access.
        </p>
        <Button icon={Plus}>Invite user</Button>
      </div>

      {/* Roles legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { r: 'Platform Admin',   d: 'Full configuration access',     c: T.red,  n: 2 },
          { r: 'Senior Auditor',   d: 'Approve rules & findings',      c: T.ink,  n: 6 },
          { r: 'Auditor',          d: 'Execute audits, draft memos',   c: '#3B82F6', n: 14 },
          { r: 'Control Owner',    d: 'Respond to findings',           c: T.warn, n: 47 },
        ].map(role => (
          <div key={role.r} style={{ padding: '14px 16px', border: `1px solid ${T.rule}`, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: role.c }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{role.r}</span>
              <span style={{ fontFamily: 'Instrument Serif', fontSize: 18, color: T.ink, letterSpacing: -0.3 }}>{role.n}</span>
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope' }}>{role.d}</div>
          </div>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '14px 24px', borderBottom: `1px solid ${T.ruleSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4, flex: 1, maxWidth: 320,
          }}>
            <Search size={14} color={T.muted} />
            <input placeholder="Search users..." style={{
              border: 'none', background: 'transparent', fontSize: 12.5, outline: 'none',
              fontFamily: 'Manrope', width: '100%', color: T.ink,
            }} />
          </div>
          <Button variant="ghost" icon={Filter} size="sm">Role: All</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 160px 90px 110px', padding: '12px 24px', borderBottom: `1px solid ${T.ruleSoft}`, fontSize: 10, color: T.muted, letterSpacing: 1.5, fontWeight: 700, fontFamily: 'Manrope', textTransform: 'uppercase', gap: 16 }}>
          <span>User</span><span>Role</span><span>Teams</span><span>MFA</span><span>Last active</span>
        </div>
        {USERS.map((u, i) => (
          <div key={u.email} style={{
            display: 'grid', gridTemplateColumns: '1fr 140px 160px 90px 110px',
            padding: '14px 24px', borderBottom: i < USERS.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            alignItems: 'center', gap: 16, transition: 'background 0.12s', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.surface}
            onMouseLeave={e => e.currentTarget.style.background = T.paper}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: u.role === 'External Auditor' ? T.warn : T.ink,
                color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 600, fontSize: 11,
              }}>{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: 'Manrope', marginTop: 1 }}>{u.email}</div>
              </div>
            </div>
            <Badge tone={u.role === 'Platform Admin' ? 'red' : u.role === 'External Auditor' ? 'warn' : 'neutral'} size="xs">{u.role}</Badge>
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.ink2 }}>{u.teams.join(', ')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {u.mfa ? <Check size={13} color={T.ok} /> : <X size={13} color={T.bad} />}
              <span style={{ fontSize: 11, fontFamily: 'Manrope', color: u.mfa ? T.ok : T.bad, fontWeight: 600 }}>{u.mfa ? 'Enabled' : 'Required'}</span>
            </div>
            <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>{u.lastActive}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: AUDIT LOG (platform activity)
// ───────────────────────────────────────────────────────────
function AdminAuditLog() {
  const catColors = { governance: T.red, config: T.warn, audit: T.ink, workflow: '#3B82F6', system: T.muted };
  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: '0 0 28px' }}>
        Immutable log of every action on the platform — who did what, when, and from where. This log itself is auditable and exportable to your SIEM.
      </p>

      {/* Filter strip */}
      <Card padding={0} style={{ marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4, flex: 1, maxWidth: 320,
          }}>
            <Search size={14} color={T.muted} />
            <input placeholder="Search log..." style={{
              border: 'none', background: 'transparent', fontSize: 12.5, outline: 'none',
              fontFamily: 'Manrope', width: '100%', color: T.ink,
            }} />
          </div>
          {[
            ['Governance', T.red],
            ['Config',     T.warn],
            ['Audit',      T.ink],
            ['Workflow',   '#3B82F6'],
            ['System',     T.muted],
          ].map(([l, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', border: `1px solid ${T.rule}`, borderRadius: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
              <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.ink2 }}>{l}</span>
            </div>
          ))}
          <Button variant="ghost" icon={ExternalLink} size="sm">Export</Button>
        </div>
      </Card>

      <Card padding={0}>
        {PLATFORM_LOG.map((e, i) => (
          <div key={i} style={{
            padding: '14px 24px', borderBottom: i < PLATFORM_LOG.length - 1 ? `1px solid ${T.ruleSoft}` : 'none',
            display: 'grid', gridTemplateColumns: '90px 160px 110px 1fr 70px', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11.5, color: T.muted }}>{e.t}</span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.ink, fontWeight: 600 }}>{e.actor}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: catColors[e.cat] }} />
              <span style={{ fontFamily: 'Manrope', fontSize: 11, color: T.ink2, textTransform: 'capitalize' }}>{e.cat}</span>
            </div>
            <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink2 }}>{e.action}</span>
            <button style={{ background: 'none', border: 'none', color: T.red, fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, cursor: 'pointer', justifySelf: 'end' }}>details →</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ADMIN PAGE: SETTINGS
// ───────────────────────────────────────────────────────────
function AdminSettings() {
  const Toggle = ({ on = true }) => (
    <div style={{ width: 32, height: 18, background: on ? T.ok : T.rule, borderRadius: 9, position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ width: 14, height: 14, background: T.paper, borderRadius: '50%', position: 'absolute', top: 2, left: on ? 16 : 2, transition: 'left 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div style={{ padding: '32px 36px 60px' }}>
      <p style={{ fontSize: 14, color: T.ink3, fontFamily: 'Manrope', maxWidth: 580, lineHeight: 1.55, margin: '0 0 28px' }}>
        Organization settings, security policy, and platform-wide defaults.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
        {/* Settings sub-nav */}
        <nav>
          {['Organization', 'Security', 'AI Governance', 'Integrations', 'Notifications', 'Data retention', 'Billing'].map((s, i) => (
            <button key={s} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 12px', border: 'none', background: i === 0 ? T.redTint : 'transparent',
              color: i === 0 ? T.ink : T.ink3, fontSize: 13, fontWeight: i === 0 ? 600 : 500,
              fontFamily: 'Manrope', cursor: 'pointer', borderRadius: 4, marginBottom: 2,
              borderLeft: i === 0 ? `2px solid ${T.red}` : '2px solid transparent',
            }}>{s}</button>
          ))}
        </nav>

        {/* Settings panel */}
        <div>
          <SectionHead>Organization</SectionHead>
          <Card padding={24} style={{ marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>Organization name</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 500 }}>Atlas Bank · Internal Audit</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>Platform tier</span>
              <Badge tone="red" size="xs">Enterprise — Tier 1 FS</Badge>
              <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>Region</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 500 }}>us-east-1 (in-region processing only)</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>Audit Committee contact</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 500 }}>audit-committee@atlasbank.com</span>
            </div>
          </Card>

          <SectionHead>Platform-wide AI governance</SectionHead>
          <Card padding={0} style={{ marginBottom: 24 }}>
            {[
              ['Require human approval for all material findings', 'Every finding of severity High or above must be approved by a named auditor before issuance.', true],
              ['Enforce citation on every AI output',                'AI claims without verifiable source citations are blocked at the output validator.',         true],
              ['Auto-pause agent on quality regression',             'If success rate drops below 95% over a 1-hour window, agent is paused for review.',          true],
              ['Block model usage outside approved registry',        'Agents may only call models in the Model Registry. New models require committee approval.', true],
              ['Quarterly second-line review',                       'Independent quarterly review of agent decisions and prompt changes.',                       true],
              ['External auditor read-only portal',                   'Provision scoped, read-only access for external auditor with reproducible reasoning.',     true],
            ].map(([k, sub, on], i, arr) => (
              <div key={k} style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <div style={{ marginTop: 2 }}><Toggle on={on} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Manrope', marginTop: 3, lineHeight: 1.5 }}>{sub}</div>
                </div>
                <button style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 }}><MoreHorizontal size={14} /></button>
              </div>
            ))}
          </Card>

          <SectionHead>Data retention</SectionHead>
          <Card padding={0}>
            {[
              ['Audit workpapers',     '7 years',    'regulatory minimum'],
              ['Evidence artifacts',   '7 years',    'aligned to workpapers'],
              ['Agent execution logs', '90 days',    'rolling, then summarized'],
              ['Platform audit log',   'Indefinite', 'immutable, exportable'],
            ].map(([k, v, sub], i, arr) => (
              <div key={k} style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '220px 110px 1fr', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.ruleSoft}` : 'none' }}>
                <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, fontWeight: 500 }}>{k}</span>
                <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.red, fontWeight: 600 }}>{v}</span>
                <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>{sub}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
//  ROOT APP
// ───────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard');

  const titles = {
    dashboard:  ['Audit Operations',           'Overview'],
    knowledge:  ['Knowledge Library',          'Documents · Rules'],
    rules:      ['Audit Rules',                'Library'],
    connectors: ['Connectors',                 'Sources & Tools'],
    audits:     ['Audits',                     'All audits'],
    'audit-detail': ['', ''],
    monitoring: ['Continuous Monitoring',      'Always-on'],
    findings:   ['Findings',                   'Open & resolved'],
    'admin-agents':   ['AI Agents',         'Admin · Agents'],
    'admin-models':   ['Model Registry',    'Admin · Models'],
    'admin-prompts':  ['Prompt Library',    'Admin · Prompts'],
    'admin-users':    ['Users & Roles',     'Admin · Access'],
    'admin-auditlog': ['Platform Audit Log','Admin · Activity'],
    'admin-settings': ['Settings',          'Admin · Configuration'],
  };
  const [title, subtitle] = titles[page] || ['', ''];

  const pageContent = {
    dashboard:  <Dashboard goto={setPage} />,
    knowledge:  <Knowledge />,
    rules:      <Rules />,
    connectors: <Connectors />,
    audits:     <Audits goto={setPage} />,
    'audit-detail': <AuditDetail goto={setPage} />,
    monitoring: <Monitoring />,
    findings:   <Findings />,
    'admin-agents':   <AdminAgents />,
    'admin-models':   <AdminModels />,
    'admin-prompts':  <AdminPrompts />,
    'admin-users':    <AdminUsers />,
    'admin-auditlog': <AdminAuditLog />,
    'admin-settings': <AdminSettings />,
  }[page];

  // Sidebar should highlight 'audits' when on audit-detail
  const sidebarPage = page === 'audit-detail' ? 'audits' : page;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: T.surface,
      fontFamily: 'Manrope, -apple-system, sans-serif',
    }}>
      <Sidebar page={sidebarPage} setPage={setPage} />

      <main style={{ flex: 1, minWidth: 0 }}>
        {page !== 'audit-detail' && (
          <TopBar
            title={title}
            subtitle={subtitle}
            actions={
              <>
                <button style={{ background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: '8px 10px', cursor: 'pointer', color: T.ink2 }}>
                  <Search size={15} />
                </button>
                <button style={{ background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: '8px 10px', cursor: 'pointer', color: T.ink2, position: 'relative' }}>
                  <Bell size={15} />
                  <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: T.red }} />
                </button>
              </>
            }
          />
        )}
        {pageContent}
      </main>
    </div>
  );
}
