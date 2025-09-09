
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'

interface DashboardData {
  numReqs: number
  videoAnalysisFreeQuota: number
  videoAnalysisPaidQuota: number
  reqs: Array<{
    id: string
    userId: string
    type: string
    url: string
    status: string
    videoResultId: string | null
    errorMessage: string | null
    processingTimeMs: number
    createdAt: string | null
    updatedAt: string | null
    startedAt: string | null
    completedAt: string | null
    result?: {
      analysisResult: string
      processingTime: number
    }
  }>
}

// ---------------------------
// Design tokens & atoms
// ---------------------------
const tokens = {
  bg: '#0B0F1A',
  surface: 'rgba(255,255,255,0.04)',
  surfaceAlt: 'rgba(30,41,59,0.45)',
  border: 'rgba(255,255,255,0.08)',
  text: '#E6E8F2',
  subtext: '#9CA3AF',
  brand: '#A78BFA',
  brand2: '#7C3AED',
  good: '#22C55E',
  warn: '#F59E0B',
  bad: '#EF4444',
  info: '#3B82F6',
}

const cardStyle: React.CSSProperties = {
  background: tokens.surface,
  border: `1px solid ${tokens.border}`,
  borderRadius: 16,
  padding: 20,
  backdropFilter: 'blur(12px)'
}

const pill = (bg: string, color = '#fff'): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '6px 10px', fontSize: 12, borderRadius: 999,
  background: bg, color,
  border: '1px solid rgba(255,255,255,0.08)'
})

const btn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 16px', borderRadius: 12, border: `1px solid ${tokens.border}`,
  background: '#111827', color: tokens.text, cursor: 'pointer', fontWeight: 600,
  transition: 'transform .15s ease, box-shadow .2s ease'
}

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: `linear-gradient(135deg, ${tokens.brand} 0%, ${tokens.brand2} 100%)`,
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#fff',
  boxShadow: '0 10px 30px rgba(124,58,237,.35)'
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#0F172A',
  border: `1px solid ${tokens.border}`, borderRadius: 12, color: tokens.text,
  outline: 'none', fontSize: 14
}

// ---------------------------
// Analysis formatting with sections + TOC + optional highlight
// ---------------------------
interface Formatted {
  html: string
  toc: { id: string; title: string }[]
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const formatAnalysisToHtmlWithSections = (text: string, highlight?: string): Formatted => {
  const lines = text.split('\n')
  const sections: { title: string; content: string[] }[] = []
  let current: { title: string; content: string[] } | null = null
  let inList = false

  const commitListIfOpen = () => { if (inList) { current?.content.push('</ul>'); inList = false } }

  const fmt = (s: string) => {
    let out = s
    // bold **text**
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E6E8F2;">$1</strong>')
    // italic *text*
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // timestamps (00:12-00:19)
    out = out.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1E293B;padding:2px 6px;border-radius:6px;font-weight:700;color:#93C5FD;font-size:12px;">$1</span>')
    if (highlight) {
      // escape regex special chars without using "$&" in the literal replacement
      const safe = highlight.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m)
      out = out.replace(new RegExp(`(${safe})`, 'ig'), '<mark style="background:#3B82F6; color:white; padding:0 3px; border-radius:4px;">$1</mark>')
    }
    return out
  }

  for (let raw of lines) {
    const line = raw.trim()
    if (!line) { commitListIfOpen(); current?.content.push('<div style="margin:10px 0"></div>'); continue }

    // Heading with emoji marker
    const match = line.match(/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/)
    if (match) {
      commitListIfOpen()
      if (current) sections.push(current)
      current = { title: `${match[1]} ${match[2]}`, content: [] }
      continue
    }

    // List item
    if (/^\s*[\*\-\•]\s*/.test(line)) {
      if (!inList) { current?.content.push('<ul style="margin:8px 0;padding-left:22px;list-style:disc;">'); inList = true }
      let li = line.replace(/^\s*[\*\-\•]\s*/, '')
      li = li.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#C4B5FD;">$1</strong>')
      li = li.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1E293B;padding:2px 6px;border-radius:6px;font-weight:700;color:#93C5FD;font-size:12px;">$1</span>')
      if (highlight) {
        const safe = highlight.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m)
        li = li.replace(new RegExp(`(${safe})`, 'ig'), '<mark style="background:#3B82F6; color:white; padding:0 3px; border-radius:4px;">$1</mark>')
      }
      current?.content.push(`<li style="margin:6px 0; line-height:1.65;">${li}</li>`)
      continue
    }

    // Paragraph
    commitListIfOpen()
    current?.content.push(`<p style="margin:8px 0; line-height:1.8; color:#CBD5E1;">${fmt(line)}</p>`)
  }

  if (current) sections.push(current)

  // Build HTML with <details>
  let html = ''
  const toc: { id: string; title: string }[] = []
  sections.forEach((s, idx) => {
    const id = `${idx + 1}-${slug(s.title)}`
    toc.push({ id, title: s.title })
    html += `
      <details open style="border:1px solid ${tokens.border}; border-radius:12px; padding:8px 12px; margin:10px 0; background:${tokens.surfaceAlt}">
        <summary id="${id}" style="cursor:pointer; user-select:none; display:flex; align-items:center; gap:8px; font-weight:700; color:${tokens.text}">
          ${s.title}
        </summary>
        <div style="padding:8px 6px 4px 6px">${s.content.join('')}</div>
      </details>`
  })

  // If no headings detected, fallback to basic formatting
  if (!sections.length) {
    const basic = text
      .split('\n')
      .map(l => `<p style=\"margin:8px 0; line-height:1.8; color:#CBD5E1;\">${l}</p>`) 
      .join('')
    html = `<div>${basic}</div>`
  }

  return { html, toc }
}

const Skeleton = ({ height = 16 }: { height?: number }) => (
  <div style={{
    height, width: '100%', borderRadius: 8,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)',
    backgroundSize: '400% 100%', animation: 'shine 1.2s ease-in-out infinite'
  }} />
)

const Badge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; label: string }> = {
    COMPLETED: { bg: tokens.good, label: 'Completed' },
    FAILED: { bg: tokens.bad, label: 'Failed' },
    QUEUED: { bg: tokens.warn, label: 'Queued' },
    PROCESSING: { bg: tokens.info, label: 'Processing' }
  }
  const item = map[status] || { bg: '#6B7280', label: status }
  return <span style={pill(item.bg)}>{item.label}</span>
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, alignItems: 'center' }}>
    <span style={{ color: tokens.subtext, fontSize: 12 }}>{label}</span>
    <div>{value}</div>
  </div>
)

const PromptChip = ({ label, onUse }: { label: string; onUse: () => void }) => (
  <button style={{ ...pill('rgba(167,139,250,0.15)', tokens.text), borderRadius: 999, border: `1px solid ${tokens.border}` }} onClick={onUse}>{label}</button>
)

// ---------------------------
// Main Component
// ---------------------------
const Dashboard: React.FC = () => {
  const { user, signOut, getAccessToken } = useAuth()
  const [videoUrl, setVideoUrl] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [urlTransformed, setUrlTransformed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'readable' | 'raw'>('readable')
  const [toast, setToast] = useState<string>('')

  const urlInputRef = useRef<HTMLInputElement | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const token = getAccessToken()
    apiService.setToken(token)
    if (token && user) {
      registerUserWithBackend(token)
      fetchDashboardData()
    }
  }, [user, getAccessToken])

  // Keyboard shortcuts: Ctrl/Cmd+Enter submit, Ctrl/Cmd+K focus URL
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'enter') { e.preventDefault(); document.getElementById('analyze-btn')?.dispatchEvent(new MouseEvent('click', { bubbles: true })) }
      if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); urlInputRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const registerUserWithBackend = async (token: string) => { try { await apiService.signUpUser(token) } catch {} }

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true); setDashboardError(null)
      const data = await apiService.getDashboardData(); setDashboardData(data)
    } catch (error) {
      setDashboardError('Unable to load usage statistics')
    } finally { setDashboardLoading(false) }
  }

  const isLikelyTikTok = (u: string) => /(^|\.)tiktok\.com\//i.test(u) || /vm\.tiktok\.com|vt\.tiktok\.com/i.test(u)

  const transformTikTokUrl = async (url: string): Promise<string> => {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      try {
        setStatusMessage('Resolving TikTok URL…')
        const response = await fetch('/api/resolve-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
        if (response.ok) {
          const data = await response.json()
          if (data.resolvedUrl && data.resolvedUrl !== url) { setStatusMessage(''); setUrlTransformed(true); return data.resolvedUrl }
        }
        setStatusMessage('')
      } catch {}
    }
    return url
  }

  const handleAnalyzeVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!videoUrl.trim()) return
    setLoading(true); setStatusMessage('Submitting analysis request…'); setCurrentAnalysis(null)
    try {
      const transformedUrl = await transformTikTokUrl(videoUrl)
      if (transformedUrl !== videoUrl) { setVideoUrl(transformedUrl) } else { setUrlTransformed(false) }
      const data = await apiService.submitAnalysisRequest(transformedUrl, customPrompt)
      if (data.status === 'cached') {
        setStatusMessage('Analysis found in cache!'); setCurrentAnalysis(data.resultAnalysis || ''); fetchDashboardData()
      } else {
        setStatusMessage(`Analysis queued. Position: ${data.queuePosition || 'N/A'}`)
        const requestId = data.jobId; pollAnalysisStatus(requestId)
      }
      localStorage.setItem('zlyzer:lastPrompt', customPrompt)
      setVideoUrl(''); setCustomPrompt(''); setUrlTransformed(false)
    } catch (error) {
      setStatusMessage('Unable to submit analysis request. Please try again.')
    } finally { setLoading(false) }
  }

  const pollAnalysisStatus = async (requestId: string) => {
    const maxAttempts = 30; let attempts = 0; setIsPolling(true)
    const poll = async () => {
      try {
        setStatusMessage(`Checking analysis status… (${attempts + 1}/${maxAttempts})`)
        const data = await apiService.getAnalysisStatus(requestId)
        if (data.status === 'COMPLETED' && data.result) {
          setStatusMessage('Analysis completed!'); setCurrentAnalysis(data.result.analysisResult); setIsPolling(false); fetchDashboardData(); return
        } else if (data.status === 'FAILED') {
          setStatusMessage(`Analysis failed: ${data.errorMessage || 'Unknown error'}`); setIsPolling(false); return
        } else {
          setStatusMessage(`Analysis ${data.status.toLowerCase()}… (${attempts + 1}/${maxAttempts})`)
        }
        attempts++
        if (attempts < maxAttempts) { setTimeout(poll, 1000) } else { setStatusMessage('Taking longer than expected. Please check back later.'); setIsPolling(false) }
      } catch (error) { setStatusMessage('Error checking status. Please refresh.'); setIsPolling(false) }
    }
    poll()
  }

  const handleSignOut = async () => { try { await signOut() } catch {} }

  // Format results + toc memoized
  const formatted = useMemo(() => currentAnalysis ? formatAnalysisToHtmlWithSections(currentAnalysis, searchTerm) : null, [currentAnalysis, searchTerm])

  const copyToClipboard = async (text: string, msg = 'Copied!') => {
    try { await navigator.clipboard.writeText(text); setToast(msg); setTimeout(()=>setToast(''), 1600) } catch {}
  }

  const downloadMarkdown = () => {
    if (!currentAnalysis) return
    const blob = new Blob([currentAnalysis], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'zlyzer-analysis.md'; a.click(); URL.revokeObjectURL(url)
  }

  const toggleAllDetails = (open: boolean) => {
    const el = resultsRef.current; if (!el) return
    el.querySelectorAll('details').forEach((d) => { (d as HTMLDetailsElement).open = open })
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(1200px 800px at 80% -10%, rgba(124,58,237,0.18), transparent 60%), ${tokens.bg}` , color: tokens.text, position:'relative' }}>

      {/* Thin progress bar while working */}
      {(loading || isPolling) && (
        <div style={{ position:'fixed', top:0, left:0, right:0, height:3, background: 'linear-gradient(90deg, transparent, #7C3AED, transparent)', backgroundSize:'200% 100%', animation:'bar 1.2s linear infinite', zIndex:100 }} />
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)', background: 'rgba(11,15,26,0.8)', borderBottom: `1px solid ${tokens.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: `linear-gradient(135deg, ${tokens.brand}, ${tokens.brand2})`, boxShadow: '0 0 18px rgba(124,58,237,.6)' }} />
            <strong style={{ letterSpacing: '.12em', color: tokens.brand }}>ZLYZER</strong>
            <span style={{ color: tokens.subtext, fontSize: 12, marginLeft: 10 }}>Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: tokens.subtext }}>Signed in as <strong style={{ color: tokens.text }}>{user?.user_metadata?.full_name || user?.email}</strong></span>
            <button style={btn} onClick={handleSignOut} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>Sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 20, display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Analyze */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap:'wrap' }}>
                <span style={pill('rgba(167,139,250,0.18)')}>🎬 Analyze TikTok</span>
                {urlTransformed && <span style={pill('#0B7A4B')}>✅ URL expanded</span>}
                {!isLikelyTikTok(videoUrl) && videoUrl && <span style={pill(tokens.bad)}>⚠ Looks not like a TikTok URL</span>}
              </div>
              <span style={{ fontSize:12, color: tokens.subtext }}>Shortcuts: ⌘/Ctrl+K to focus • ⌘/Ctrl+Enter to analyze</span>
            </div>

            <form onSubmit={(e)=>{ e.preventDefault(); handleAnalyzeVideo() }} style={{ display: 'grid', gap: 12 }}>
              <label style={{ fontSize: 12, color: tokens.subtext }}>TikTok Video URL</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <input ref={urlInputRef} type="url" value={videoUrl} onChange={(e)=>{ setVideoUrl(e.target.value); setUrlTransformed(false) }} placeholder="https://www.tiktok.com/@username/video/..." required style={inputBase} />
                <button id="analyze-btn" type="submit" disabled={loading} style={{ ...btnPrimary, minWidth: 160 }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  {loading ? 'Analyzing…' : 'Analyze'}
                </button>
              </div>

              <label style={{ fontSize: 12, color: tokens.subtext, marginTop: 6 }}>Custom Analysis Prompt (optional)</label>
              <textarea value={customPrompt} onChange={(e)=>setCustomPrompt(e.target.value)} placeholder="e.g., Focus on hook effectiveness, retention dips, trending sounds" style={{ ...inputBase, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Hook & retention','Audience insights','Hashtags & trends','Sound & script','Competitor differences'].map(p => (
                  <PromptChip key={p} label={p} onUse={()=> setCustomPrompt(p)} />
                ))}
              </div>
            </form>

            {/* Inline status */}
            {statusMessage && (
              <div style={{ marginTop: 14, ...cardStyle, background: tokens.surfaceAlt }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>Status</strong>
                <span style={{ color: tokens.subtext }}>{statusMessage}</span>
                {(loading || isPolling) && <div style={{ marginTop: 10 }}><Skeleton height={8} /></div>}
              </div>
            )}
          </section>

          {/* Analysis results */}
          {currentAnalysis && (
            <section style={{ ...cardStyle, padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${tokens.border}`, gap:12, flexWrap:'wrap' }}>
                <h3 style={{ margin: 0 }}>Analysis Results</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap:'wrap' }}>
                  <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search in results…" style={{ ...inputBase, width:220, padding:'8px 10px', fontSize:12 }} />
                  <button title="Copy analysis" style={btn} onClick={()=> copyToClipboard(currentAnalysis)} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>📋 Copy</button>
                  <button title="Download Markdown" style={btn} onClick={downloadMarkdown} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>⬇️ .md</button>
                  <button title="Expand all" style={btn} onClick={()=>toggleAllDetails(true)}>➕ Expand</button>
                  <button title="Collapse all" style={btn} onClick={()=>toggleAllDetails(false)}>➖ Collapse</button>
                  <button title="Toggle raw" style={btn} onClick={()=> setViewMode(v => v==='readable'?'raw':'readable')}>{viewMode==='readable' ? 'Raw view' : 'Readable view'}</button>
                </div>
              </div>

              {/* TOC + Content */}
              <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:16, padding:16 }}>
                <nav style={{ ...cardStyle, padding:12, position:'sticky', top:86, alignSelf:'start', maxHeight: '60vh', overflowY:'auto' }}>
                  <strong style={{ fontSize:12, color: tokens.subtext, display:'block', marginBottom:8 }}>Sections</strong>
                  {formatted?.toc?.length ? (
                    <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:6 }}>
                      {formatted!.toc.map(({ id, title }) => (
                        <li key={id}>
                          <a href={`#${id}`} style={{ color:'#93C5FD', textDecoration:'none', fontSize:13 }}>{title}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: tokens.subtext, fontSize:12 }}>No sections detected</span>
                  )}
                </nav>

                <div ref={resultsRef} style={{ ...cardStyle, padding: 16, maxHeight: '70vh', overflowY: 'auto' }}>
                  {viewMode==='raw' ? (
                    <pre style={{ whiteSpace:'pre-wrap', margin:0, fontSize:13, lineHeight:1.7, color:'#CBD5E1' }}>{currentAnalysis}</pre>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: formatted?.html || '' }} />
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Usage stats */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Usage</h3>
              <button style={{ ...btn, fontSize: 12 }} onClick={fetchDashboardData}>↻ Refresh</button>
            </div>
            {dashboardLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                <Skeleton height={54} /><Skeleton height={54} /><Skeleton height={54} />
              </div>
            ) : dashboardError ? (
              <p style={{ color: tokens.subtext }}>{dashboardError}</p>
            ) : dashboardData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[{label:'Total Requests', value: dashboardData.numReqs},{label:'Free Quota', value: dashboardData.videoAnalysisFreeQuota},{label:'Paid Quota', value: dashboardData.videoAnalysisPaidQuota}].map((s, i)=> (
                  <div key={i} style={{ ...cardStyle, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: tokens.subtext }}>{s.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: tokens.subtext }}>No data available</p>
            )}
          </section>

          {/* Recent requests with quick filters */}
          <section style={{ ...cardStyle, maxHeight: 520, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap:8, flexWrap:'wrap' }}>
              <h3 style={{ margin: 0 }}>Recent Analyses</h3>
            </div>
            <div style={{ overflowY: 'auto', paddingRight: 6 }}>
              {dashboardData && dashboardData.reqs.length > 0 ? (
                dashboardData.reqs.map((req) => (
                  <div key={req.id} style={{ ...cardStyle, padding: 14, marginBottom: 10, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <Row label="URL" value={<a href={req.url} target="_blank" rel="noreferrer" style={{ color: '#93C5FD', textDecoration: 'none' }}>{req.url}</a>} />
                        <Row label="Status" value={<Badge status={req.status} />} />
                        <Row label="Processing" value={<span>{req.processingTimeMs} ms</span>} />
                        {req.createdAt && <Row label="Created" value={<span>{new Date(req.createdAt).toLocaleString()}</span>} />}
                        {req.errorMessage && req.status==='FAILED' && (
                          <Row label="Error" value={<span style={{ color: tokens.bad }}>{req.errorMessage}</span>} />
                        )}
                      </div>
                      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
                        <button style={btn} onClick={() => copyToClipboard(req.url, 'URL copied')}>Copy URL</button>
                        {req.videoResultId && <a style={{ ...btn, textDecoration: 'none' }} href={`#/analysis/${req.videoResultId}`}>Open</a>}
                        {req.url && <a style={{ ...btn, textDecoration: 'none' }} href={req.url} target="_blank" rel="noreferrer">View Video</a>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                  <p style={{ color: tokens.subtext, margin: 0 }}>No requests yet. Run your first analysis above.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', right:16, bottom:16, background:'#111827', border:`1px solid ${tokens.border}`, color:tokens.text, padding:'10px 14px', borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,.35)', zIndex:200 }}>{toast}</div>
      )}

      <style>{`
        @keyframes shine { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes bar { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

export default Dashboard
