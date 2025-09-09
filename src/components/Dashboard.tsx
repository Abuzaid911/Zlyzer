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

const formatAnalysisToHtml = (text: string): string => {
  const lines = text.split('\n')
  let html = ''
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += '<div style="margin: 10px 0;"></div>'
      continue
    }

    if (/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/.test(line)) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      const match = line.match(/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/)
      if (match) {
        html += `<h3 style="color:#e5e7eb;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:8px;font-size:18px;">${match[1]} ${match[2]}</h3>`
      }
      continue
    }

    if (/^\s*[\*\-\•]\s*/.test(line)) {
      if (!inList) {
        html += '<ul style="margin:8px 0 8px 8px;padding-left:20px;list-style:disc;">'
        inList = true
      }
      let listContent = line.replace(/^\s*[\*\-\•]\s*/, '')
      listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#a78bfa;">$1<\/strong>')
      listContent = listContent.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1f2937;padding:2px 6px;border-radius:4px;font-weight:600;color:#93c5fd;font-size:12px;">$1<\/span>')
      html += `<li style="margin:6px 0;line-height:1.6;">${listContent}</li>`
      continue
    }

    if (inList) {
      html += '</ul>'
      inList = false
    }

    let paragraph = line
    paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e5e7eb;">$1<\/strong>')
    paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em>$1<\/em>')
    paragraph = paragraph.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background:#1f2937;padding:2px 6px;border-radius:4px;font-weight:600;color:#93c5fd;font-size:12px;">$1<\/span>')
    html += `<p style="margin:8px 0;line-height:1.7;color:#d1d5db;">${paragraph}</p>`
  }

  if (inList) html += '</ul>'
  return html
}

const Badge = ({ color = '#22c55e', children }: { color?: string; children: React.ReactNode }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color
  }}>{children}</span>
)

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div style={styles.statCard}>
    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: '#E5E7EB' }}>{value}</div>
  </div>
)

const Progress = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)))
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: 12 }}>
        <span>{label}</span><span>{value}/{max}</span>
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg,#8B5CF6,#06b6d4)' }} />
      </div>
    </div>
  )
}

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
    try { await apiService.signUpUser(token) } catch { /* non-blocking */ }
  }

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      setDashboardError(null)
      const data = await apiService.getDashboardData()
      setDashboardData(data)
    } catch {
      setDashboardError('Unable to load usage statistics')
    } finally {
      setDashboardLoading(false)
    }
  }

  const transformTikTokUrl = async (url: string): Promise<string> => {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      try {
        setStatusMessage('Resolving TikTok URL…')
        const response = await fetch('/api/resolve-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
        if (response.ok) {
          const data = await response.json()
          if (data.resolvedUrl && data.resolvedUrl !== url) {
            setStatusMessage('')
            setUrlTransformed(true)
            return data.resolvedUrl
          }
        }
        setStatusMessage('')
      } catch { setStatusMessage('') }
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
        setStatusMessage(`Analysis queued. Position: ${data.queuePosition || 'N/A'} — ETA: ${data.estimatedWait || 'calculating…'}`)
        const requestId = data.jobId
        pollAnalysisStatus(requestId)
      }
      setVideoUrl('')
      setCustomPrompt('')
      setUrlTransformed(false)
    } catch {
      setStatusMessage('Unable to submit analysis request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pollAnalysisStatus = async (requestId: string) => {
    const maxAttempts = 60 // 5 minutes at 5s per poll
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
          setStatusMessage(`Analysis ${String(data.status).toLowerCase()}… (${attempts + 1}/${maxAttempts})`)
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          setStatusMessage('Analysis is taking longer than expected. Please check back later.')
          setIsPolling(false)
        }
      } catch {
        setStatusMessage('Error checking analysis status. Please refresh to see results.')
        setIsPolling(false)
      }
    }

    poll()
  }

  const handleSignOut = async () => { try { await signOut() } catch { /* noop */ } }

  return (
    <div style={styles.appShell}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoDot} />
          <strong style={styles.brandText}>ZLYZER</strong>
          <Badge color="#a78bfa">Dashboard</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#9CA3AF', fontSize: 14 }}>Welcome, <strong style={{ color: '#E5E7EB' }}>{user?.user_metadata?.full_name || user?.email}</strong></span>
          <button onClick={handleSignOut} style={styles.ghostBtn}>Sign Out</button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Analyze Card */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Analyze TikTok Video</h2>
            <Badge color="#60a5fa">AI Analysis</Badge>
          </div>
          <form onSubmit={handleAnalyzeVideo} style={{ display: 'grid', gap: 14 }}>
            <label style={styles.label}>TikTok Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => { setVideoUrl(e.target.value); setUrlTransformed(false) }}
              placeholder="https://www.tiktok.com/@username/video/..."
              required
              style={styles.input}
            />
            {urlTransformed && (
              <small style={{ color: '#10b981' }}>✅ Short URL resolved to full TikTok link</small>
            )}

            <label style={styles.label}>Custom Analysis Prompt (optional)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Focus on hook, pacing, trending sounds, hashtag fit"
              style={{ ...styles.input, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }}
            />

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button type="submit" disabled={loading} style={styles.primaryBtn}>
                {loading ? 'Analyzing…' : 'Analyze Video'}
              </button>
              <button type="button" onClick={() => { setVideoUrl(''); setCustomPrompt('') }} style={styles.ghostBtn}>Clear</button>
            </div>
          </form>

          {(statusMessage || isPolling) && (
            <div style={styles.statusBox}>
              <span style={{ color: '#E5E7EB' }}><strong>Status:</strong> {statusMessage}</span>
              {(loading || isPolling) && <span style={{ color: '#9CA3AF' }}>Processing…</span>}
            </div>
          )}
        </section>

        {/* Stats & Quotas */}
        <section style={{ display: 'grid', gap: 14 }}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Usage Overview</h2>
              {!dashboardLoading && !dashboardError && dashboardData && (
                <Badge color="#22c55e">Live</Badge>
              )}
            </div>
            {dashboardLoading ? (
              <p style={{ color: '#9CA3AF' }}>Loading…</p>
            ) : dashboardError ? (
              <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Usage statistics temporarily unavailable</p>
            ) : dashboardData ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={styles.statGrid}>
                  <StatCard label="Total Requests" value={dashboardData.numReqs} />
                  <StatCard label="Free Quota Remaining" value={dashboardData.videoAnalysisFreeQuota} />
                  <StatCard label="Paid Quota Remaining" value={dashboardData.videoAnalysisPaidQuota} />
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <Progress value={dashboardData.videoAnalysisFreeQuota} max={100} label="Free quota" />
                  <Progress value={dashboardData.videoAnalysisPaidQuota} max={1000} label="Paid quota" />
                </div>
              </div>
            ) : (
              <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No data available</p>
            )}
          </div>

          {/* Recent Requests */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Recent Analysis Requests</h2>
            </div>
            {!dashboardData || dashboardData.reqs.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No recent requests yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                {dashboardData.reqs.map((req) => (
                  <div key={req.id} style={styles.reqRow}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ fontSize: 14, color: '#E5E7EB', wordBreak: 'break-all' }}>
                        <strong>URL:</strong> {req.url}
                      </div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                        <strong>Status:</strong> {req.status} • <strong>Processing:</strong> {req.processingTimeMs}ms
                      </div>
                      {req.createdAt && (
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                          <strong>Created:</strong> {new Date(req.createdAt).toLocaleString()}
                        </div>
                      )}
                      {req.errorMessage && (
                        <div style={{ fontSize: 12, color: '#fca5a5' }}>
                          <strong>Error:</strong> {req.errorMessage}
                        </div>
                      )}
                    </div>
                    <span style={{ ...styles.statusPill, ...(req.status === 'COMPLETED' ? styles.ok : req.status === 'FAILED' ? styles.err : styles.warn) }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Analysis Result */}
        {currentAnalysis && (
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Analysis Results</h2>
              <button
                onClick={() => currentAnalysis && navigator.clipboard.writeText(currentAnalysis)}
                style={styles.ghostBtnSmall}
                title="Copy analysis to clipboard"
              >📋 Copy</button>
            </div>
            <div style={styles.resultBox}>
              <div dangerouslySetInnerHTML={{ __html: formatAnalysisToHtml(currentAnalysis) }} />
            </div>
          </section>
        )}
      </main>

      <footer style={styles.footer}>© {new Date().getFullYear()} Zlyzer</footer>
    </div>
  )
}

export default Dashboard

// ----------------- Styles -----------------
const styles: Record<string, React.CSSProperties> = {
  appShell: {
    minHeight: '100vh',
    background: 'radial-gradient(1200px 800px at 80% 10%, rgba(139,92,246,0.12), transparent 60%), #0A0A1F',
    color: '#fff',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    padding: 24
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(10px)',
    marginBottom: 16
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoDot: { width: 10, height: 10, borderRadius: 999, background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', boxShadow: '0 0 16px rgba(192,132,252,0.7)' },
  brandText: { letterSpacing: '0.12em', fontSize: 12, color: '#C4B5FD' },
  main: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: '1.2fr 1fr',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)'
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  },
  cardTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#E5E7EB' },
  label: { fontSize: 12, color: '#9CA3AF' },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    outline: 'none'
  },
  primaryBtn: {
    appearance: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'linear-gradient(135deg,#8B5CF6,#06b6d4)',
    color: '#fff',
    padding: '12px 16px',
    fontWeight: 700,
    borderRadius: 12,
    cursor: 'pointer',
  },
  ghostBtn: {
    appearance: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#e5e7eb',
    padding: '10px 14px',
    fontWeight: 600,
    borderRadius: 12,
    cursor: 'pointer',
  },
  ghostBtnSmall: {
    appearance: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: '#e5e7eb',
    padding: '6px 10px',
    fontWeight: 600,
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 12
  },
  statusBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 12
  },
  statCard: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 14
  },
  reqRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12
  },
  statusPill: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    alignSelf: 'flex-start'
  },
  ok: { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.35)' },
  err: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.35)' },
  warn: { background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.35)' },
  resultBox: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    padding: 20,
    maxHeight: 520,
    overflowY: 'auto'
  },
  footer: {
    marginTop: 16,
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center'
  }
}
