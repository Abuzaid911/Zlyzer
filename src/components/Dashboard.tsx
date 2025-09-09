import React, { useState, useEffect } from 'react'
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
// Helpers & UI utilities
// ---------------------------
const tokens = {
  bg: '#0B0F1A',
  surface: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: '#E6E8F2',
  subtext: '#9CA3AF',
  brand: '#A78BFA',
  brand2: '#7C3AED',
  good: '#22C55E',
  warn: '#F59E0B',
  bad: '#EF4444',
}

const cardStyle: React.CSSProperties = {
  background: tokens.surface,
  border: `1px solid ${tokens.border}`,
  borderRadius: 16,
  padding: 20,
  backdropFilter: 'blur(12px)'
}

const pill = (bg: string, color = '#fff'): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  fontSize: 12,
  borderRadius: 999,
  background: bg,
  color,
  border: '1px solid rgba(255,255,255,0.08)'
})

const btn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 16px',
  borderRadius: 12,
  border: `1px solid ${tokens.border}`,
  background: '#111827',
  color: tokens.text,
  cursor: 'pointer',
  fontWeight: 600,
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
  width: '100%',
  padding: '12px 14px',
  background: '#0F172A',
  border: `1px solid ${tokens.border}`,
  borderRadius: 12,
  color: tokens.text,
  outline: 'none',
  fontSize: 14
}

// Existing formatter kept (with brand colors) -------------------------------
const formatAnalysisToHtml = (text: string): string => {
  const lines = text.split('\n')
  let html = ''
  let inList = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      if (inList) { html += '</ul>'; inList = false }
      html += '<div style="margin:12px 0;"></div>'
      continue
    }
    if (/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/.test(line)) {
      if (inList) { html += '</ul>'; inList = false }
      const match = line.match(/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/)
      if (match) {
        html += `<h3 style="color:#E6E8F2;margin:22px 0 10px 0;padding-bottom:8px;border-bottom:1px solid ${tokens.border};font-size:18px;">${match[1]} ${match[2]}</h3>`
      }
      continue
    }
    if (/^\s*[\*\-\•]\s*/.test(line)) {
      if (!inList) { html += '<ul style="margin:8px 0;padding-left:22px;list-style:disc;">'; inList = true }
      let listContent = line.replace(/^\s*[\*\-\•]\s*/, '')
      listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#C4B5FD;">$1</strong>')
      listContent = listContent.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1E293B;padding:2px 6px;border-radius:6px;font-weight:700;color:#93C5FD;font-size:12px;">$1</span>')
      html += `<li style="margin:6px 0;line-height:1.6;">${listContent}</li>`
      continue
    }
    if (inList) { html += '</ul>'; inList = false }
    let paragraph = line
    paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E6E8F2;">$1</strong>')
    paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    paragraph = paragraph.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1E293B;padding:2px 6px;border-radius:6px;font-weight:700;color:#93C5FD;font-size:12px;">$1</span>')
    html += `<p style="margin:8px 0;line-height:1.8;color:#CBD5E1;">${paragraph}</p>`
  }
  if (inList) html += '</ul>'
  return html
}

const Skeleton = ({ height = 16 }: { height?: number }) => (
  <div style={{
    height,
    width: '100%',
    borderRadius: 8,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)',
    backgroundSize: '400% 100%',
    animation: 'shine 1.2s ease-in-out infinite'
  }} />
)

const Badge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; label: string }> = {
    COMPLETED: { bg: tokens.good, label: 'Completed' },
    FAILED: { bg: tokens.bad, label: 'Failed' },
    QUEUED: { bg: tokens.warn, label: 'Queued' },
    PROCESSING: { bg: '#3B82F6', label: 'Processing' }
  }
  const item = map[status] || { bg: '#6B7280', label: status }
  return <span style={pill(item.bg)}>{item.label}</span>
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
    <span style={{ color: tokens.subtext, fontSize: 12 }}>{label}</span>
    <div>{value}</div>
  </div>
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

  useEffect(() => {
    const token = getAccessToken()
    apiService.setToken(token)
    if (token && user) {
      registerUserWithBackend(token)
      fetchDashboardData()
    }
  }, [user, getAccessToken])

  const registerUserWithBackend = async (token: string) => {
    try { await apiService.signUpUser(token) } catch {}
  }

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      setDashboardError(null)
      const data = await apiService.getDashboardData()
      setDashboardData(data)
    } catch (error) {
      setDashboardError('Unable to load usage statistics')
    } finally {
      setDashboardLoading(false)
    }
  }

  const transformTikTokUrl = async (url: string): Promise<string> => {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      try {
        setStatusMessage('Resolving TikTok URL…')
        const response = await fetch('/api/resolve-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
        if (response.ok) {
          const data = await response.json()
          if (data.resolvedUrl && data.resolvedUrl !== url) {
            setStatusMessage('')
            setUrlTransformed(true)
            return data.resolvedUrl
          }
        }
        setStatusMessage('')
      } catch {}
    }
    return url
  }

  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return
    setLoading(true)
    setStatusMessage('Submitting analysis request…')
    setCurrentAnalysis(null)
    try {
      const transformedUrl = await transformTikTokUrl(videoUrl)
      if (transformedUrl !== videoUrl) { setVideoUrl(transformedUrl) } else { setUrlTransformed(false) }
      const data = await apiService.submitAnalysisRequest(transformedUrl, customPrompt)
      if (data.status === 'cached') {
        setStatusMessage('Analysis found in cache!')
        setCurrentAnalysis(data.resultAnalysis || '')
        fetchDashboardData()
      } else {
        setStatusMessage(`Analysis queued. Position: ${data.queuePosition || 'N/A'}`)
        const requestId = data.jobId
        pollAnalysisStatus(requestId)
      }
      setVideoUrl('')
      setCustomPrompt('')
      setUrlTransformed(false)
    } catch (error) {
      setStatusMessage('Unable to submit analysis request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pollAnalysisStatus = async (requestId: string) => {
    const maxAttempts = 30
    let attempts = 0
    setIsPolling(true)
    const poll = async () => {
      try {
        setStatusMessage(`Checking analysis status… (${attempts + 1}/${maxAttempts})`)
        const data = await apiService.getAnalysisStatus(requestId)
        if (data.status === 'COMPLETED' && data.result) {
          setStatusMessage('Analysis completed!')
          setCurrentAnalysis(data.result.analysisResult)
          setIsPolling(false)
          fetchDashboardData()
          return
        } else if (data.status === 'FAILED') {
          setStatusMessage(`Analysis failed: ${data.errorMessage || 'Unknown error'}`)
          setIsPolling(false)
          return
        } else {
          setStatusMessage(`Analysis ${data.status.toLowerCase()}… (${attempts + 1}/${maxAttempts})`)
        }
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000)
        } else {
          setStatusMessage('Analysis is taking longer than expected. Please check back later.')
          setIsPolling(false)
        }
      } catch (error) {
        setStatusMessage('Error checking analysis status. Please refresh to see results.')
        setIsPolling(false)
      }
    }
    poll()
  }

  const handleSignOut = async () => { try { await signOut() } catch {} }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(1200px 800px at 80% -10%, rgba(124,58,237,0.18), transparent 60%), ${tokens.bg}` , color: tokens.text }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={pill('rgba(167,139,250,0.18)')}>🎬 Analyze TikTok</span>
                {urlTransformed && <span style={pill('#0B7A4B')}>✅ URL expanded</span>}
              </div>
            </div>
            <form onSubmit={handleAnalyzeVideo} style={{ display: 'grid', gap: 12 }}>
              <label style={{ fontSize: 12, color: tokens.subtext }}>TikTok Video URL</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <input type="url" value={videoUrl} onChange={(e)=>{ setVideoUrl(e.target.value); setUrlTransformed(false) }} placeholder="https://www.tiktok.com/@username/video/..." required style={inputBase} />
                <button type="submit" disabled={loading} style={{ ...btnPrimary, minWidth: 160 }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  {loading ? 'Analyzing…' : 'Analyze'}
                </button>
              </div>

              <label style={{ fontSize: 12, color: tokens.subtext, marginTop: 6 }}>Custom Analysis Prompt (optional)</label>
              <textarea value={customPrompt} onChange={(e)=>setCustomPrompt(e.target.value)} placeholder="e.g., Focus on hook effectiveness, retention dips, trending sounds" style={{ ...inputBase, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }} />
              <span style={{ fontSize: 12, color: tokens.subtext }}>Tip: Be specific. Example: <em>“Compare this to top 5 competitors and highlight missed trends.”</em></span>
            </form>

            {/* Inline status */}
            {statusMessage && (
              <div style={{ marginTop: 14, ...cardStyle, background: 'rgba(30,41,59,0.5)' }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>Status</strong>
                <span style={{ color: tokens.subtext }}>{statusMessage}</span>
                {(loading || isPolling) && <div style={{ marginTop: 10 }}><Skeleton height={8} /></div>}
              </div>
            )}
          </section>

          {/* Analysis results */}
          {currentAnalysis && (
            <section style={{ ...cardStyle, padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${tokens.border}` }}>
                <h3 style={{ margin: 0 }}>Analysis Results</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    title="Copy analysis"
                    style={btn}
                    onClick={() => navigator.clipboard.writeText(currentAnalysis)}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                  >📋 Copy</button>
                </div>
              </div>
              <div style={{ padding: 18, maxHeight: 520, overflowY: 'auto' }}>
                <div dangerouslySetInnerHTML={{ __html: formatAnalysisToHtml(currentAnalysis) }} />
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

          {/* Recent requests */}
          <section style={{ ...cardStyle, maxHeight: 480, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
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
                        <button style={btn} onClick={() => navigator.clipboard.writeText(req.url)}>Copy URL</button>
                        {req.videoResultId && <a style={{ ...btn, textDecoration: 'none' }} href={`#/analysis/${req.videoResultId}`}>Open</a>}
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

      <style>{`
        @keyframes shine { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

export default Dashboard
