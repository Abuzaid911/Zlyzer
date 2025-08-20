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
    
    // Headers with emojis (🔍 1. Title)
    if (/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/.test(line)) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      const match = line.match(/^([🔍🎬🗣️🎧🎨🎯👥🧠])\s*(\d+\.\s*.+)$/)
      if (match) {
        html += `<h3 style="color: #2c3e50; margin: 25px 0 15px 0; padding: 10px 0 8px 0; border-bottom: 2px solid #3498db; font-size: 18px;">${match[1]} ${match[2]}</h3>`
      }
      continue
    }
    
    // List items (*, -, •)
    if (/^\s*[\*\-\•]\s*/.test(line)) {
      if (!inList) {
        html += '<ul style="margin: 10px 0; padding-left: 25px; list-style-type: disc;">'
        inList = true
      }
      let listContent = line.replace(/^\s*[\*\-\•]\s*/, '')
      
      // Format bold text in list items
      listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #2980b9;">$1</strong>')
      
      // Format timestamps
      listContent = listContent.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background: #e8f4f8; padding: 2px 6px; border-radius: 3px; font-weight: bold; color: #2980b9; font-size: 12px;">$1</span>')
      
      html += `<li style="margin: 6px 0; line-height: 1.5;">${listContent}</li>`
      continue
    }
    
    // Regular paragraphs
    if (inList) {
      html += '</ul>'
      inList = false
    }
    
    let paragraph = line
    
    // Format bold text
    paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #2c3e50;">$1</strong>')
    
    // Format italic text
    paragraph = paragraph.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Format timestamps
    paragraph = paragraph.replace(/\((\d+:\d+(?:-\d+:\d+)?)\)/g, '<span style="background: #e8f4f8; padding: 2px 6px; border-radius: 3px; font-weight: bold; color: #2980b9; font-size: 12px;">$1</span>')
    
    html += `<p style="margin: 8px 0; line-height: 1.6;">${paragraph}</p>`
  }
  
  if (inList) {
    html += '</ul>'
  }
  
  return html
}

const Dashboard: React.FC = () => {
  const { user, signOut, getAccessToken } = useAuth()
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [urlTransformed, setUrlTransformed] = useState(false)

  useEffect(() => {
    // Set the API token when user changes
    const token = getAccessToken()
    apiService.setToken(token)

    // Register user with backend if they're signed in
    if (token && user) {
      registerUserWithBackend(token)
      fetchDashboardData()
    }
  }, [user, getAccessToken])

  const registerUserWithBackend = async (token: string) => {
    try {
      await apiService.signUpUser(token)
    } catch (error) {
      // Silently handle registration - non-critical for app functionality
    }
  }

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      setDashboardError(null)
      
      const data = await apiService.getDashboardData()
      setDashboardData(data)
    } catch (error) {
      // Silently handle dashboard errors - will fall back to empty state
      setDashboardError('Unable to load usage statistics')
    } finally {
      setDashboardLoading(false)
    }
  }

  const transformTikTokUrl = async (url: string): Promise<string> => {
    // Handle vm.tiktok.com and other TikTok short URLs
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      try {
        setStatusMessage('Resolving TikTok URL...')
        const response = await fetch('/api/resolve-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      } catch (error) {
        // If resolution fails, continue with original URL
        setStatusMessage('')
      }
    }
    return url
  }

  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return

    setLoading(true)
    setStatusMessage('Submitting analysis request...')
    setCurrentAnalysis(null)
    
    try {
      // Transform the URL if it's a TikTok short link
      const transformedUrl = await transformTikTokUrl(videoUrl)
      
      // Update the input field with the transformed URL if it changed
      if (transformedUrl !== videoUrl) {
        setVideoUrl(transformedUrl)
      } else {
        setUrlTransformed(false)
      }
      
      const data = await apiService.submitAnalysisRequest(transformedUrl)
      console.log('Analysis request response:', data)
      
      if (data.status === 'cached') {
        // Analysis already exists
        setStatusMessage('Analysis found in cache!')
        setCurrentAnalysis(data.resultAnalysis || '')
        // Refresh dashboard data to update usage statistics
        fetchDashboardData()
      } else {
        // Analysis queued
        setStatusMessage(`Analysis queued. Position: ${data.queuePosition || 'N/A'}, Estimated wait: ${data.estimatedWait || 'calculating...'}`)
        const requestId = data.jobId
        pollAnalysisStatus(requestId)
      }
      setVideoUrl('')
      setUrlTransformed(false)
    } catch (error) {
      setStatusMessage('Unable to submit analysis request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pollAnalysisStatus = async (requestId: string) => {
    const maxAttempts = 30 // 5 minutes max
    let attempts = 0
    setIsPolling(true)

    const poll = async () => {
      try {
        setStatusMessage(`Checking analysis status... (${attempts + 1}/${maxAttempts})`)
        const data = await apiService.getAnalysisStatus(requestId)
        console.log('Analysis status response:', data)
        
        if (data.status === 'COMPLETED' && data.result) {
          setStatusMessage('Analysis completed!')
          setCurrentAnalysis(data.result.analysisResult)
          setIsPolling(false)
          // Refresh dashboard data to update usage statistics
          fetchDashboardData()
          return
        } else if (data.status === 'FAILED') {
          console.error('Analysis failed:', data.errorMessage)
          setStatusMessage(`Analysis failed: ${data.errorMessage || 'Unknown error'}`)
          setIsPolling(false)
          return
        } else {
          setStatusMessage(`Analysis ${data.status.toLowerCase()}... (${attempts + 1}/${maxAttempts})`)
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000) // Poll every 10 seconds
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

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      // Silently handle sign out errors
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem 0'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: '0.9',
            margin: '0'
          }}>
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>

        <main>
          {/* Analysis Form */}
          <section style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              🎬 Analyze TikTok Video
            </h2>
            <form onSubmit={handleAnalyzeVideo}>
              <p>
                <label htmlFor="videoUrl"><strong>TikTok Video URL:</strong></label><br />
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value)
                    setUrlTransformed(false)
                  }}
                  placeholder="https://www.tiktok.com/@username/video/..."
                  style={{ 
                    width: '100%', 
                    maxWidth: '500px',
                    padding: '8px',
                    border: '1px solid black',
                    fontSize: '16px'
                  }}
                  required
                />
                {urlTransformed && (
                  <small style={{ 
                    color: '#28a745', 
                    fontSize: '12px', 
                    marginTop: '5px', 
                    display: 'block' 
                  }}>
                    ✅ Short URL resolved to full TikTok link
                  </small>
                )}
              </p>
              <p>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Analyzing...' : 'Analyze Video'}
                </button>
              </p>
            </form>
          </section>

          {/* Status Message */}
          {statusMessage && (
            <section style={{ 
              border: '1px solid black', 
              padding: '15px', 
              marginBottom: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              <p><strong>Status:</strong> {statusMessage}</p>
              {(loading || isPolling) && <p><em>Processing...</em></p>}
            </section>
          )}

          {/* Analysis Results */}
          {currentAnalysis && (
            <section style={{ border: '1px solid black', padding: '20px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>Analysis Results</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(currentAnalysis)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title="Copy analysis to clipboard"
                >
                  📋 Copy
                </button>
              </div>
              <div style={{ 
                border: '1px solid #ddd', 
                padding: '25px', 
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '14px',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <div dangerouslySetInnerHTML={{ __html: formatAnalysisToHtml(currentAnalysis) }} />
              </div>
            </section>
          )}

          {/* Usage Stats */}
          <section style={{ border: '1px solid black', padding: '20px' }}>
            <h2>Usage Statistics</h2>
            {dashboardLoading ? (
              <p>Loading...</p>
            ) : dashboardError ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Usage statistics temporarily unavailable
              </p>
            ) : dashboardData ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                      <strong>{dashboardData.numReqs}</strong><br />Total Requests
                    </td>
                    <td style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                      <strong>{dashboardData.videoAnalysisFreeQuota}</strong><br />Free Quota Remaining
                    </td>
                    <td style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                      <strong>{dashboardData.videoAnalysisPaidQuota}</strong><br />Paid Quota Remaining
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No data available
              </p>
            )}
          </section>

          {/* Recent Analysis Requests */}
          {dashboardData && dashboardData.reqs.length > 0 && (
            <section style={{ border: '1px solid black', padding: '20px', marginTop: '20px' }}>
              <h2>Recent Analysis Requests</h2>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {dashboardData.reqs.map((req) => (
                  <div key={req.id} style={{ 
                    border: '1px solid #ccc', 
                    padding: '10px', 
                    marginBottom: '10px',
                    backgroundColor: req.status === 'COMPLETED' ? '#f8f9fa' : '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                          <strong>URL:</strong> {req.url}
                        </p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                          <strong>Status:</strong> {req.status} | 
                          <strong> Processing Time:</strong> {req.processingTimeMs}ms
                        </p>
                        {req.createdAt && (
                          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                            <strong>Created:</strong> {new Date(req.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div style={{ 
                        padding: '2px 8px', 
                        fontSize: '12px', 
                        backgroundColor: req.status === 'COMPLETED' ? '#28a745' : 
                                      req.status === 'FAILED' ? '#dc3545' : '#ffc107',
                        color: req.status === 'COMPLETED' ? 'white' : 
                               req.status === 'FAILED' ? 'white' : 'black',
                        borderRadius: '3px'
                      }}>
                        {req.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
