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
      console.log('✅ User successfully registered with backend')
    } catch (error) {
      // User registration failed - this is non-critical for app functionality
      // The user can still use the app for analysis requests
      console.warn('⚠️  Backend user registration failed (non-critical):', error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      setDashboardError(null)
      
      const data = await apiService.getDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDashboardError(error instanceof Error ? error.message : 'Failed to load dashboard data')
    } finally {
      setDashboardLoading(false)
    }
  }

  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return

    setLoading(true)
    setStatusMessage('Submitting analysis request...')
    setCurrentAnalysis(null)
    
    try {
      const data = await apiService.submitAnalysisRequest(videoUrl)
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
    } catch (error) {
      console.error('Error submitting analysis request:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit analysis request'
      
      if (errorMessage.includes('422') || errorMessage.includes('validation')) {
        setStatusMessage('⚠️ API authentication issue. The backend may be expecting a different token format. Please try again or contact support.')
      } else {
        setStatusMessage(`Error: ${errorMessage}`)
      }
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
        console.error('Error polling analysis status:', error)
        setStatusMessage(`Polling error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsPolling(false)
      }
    }

    poll()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      {/* Header */}
      <div className="container">
        <header style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>ZLYZER DASHBOARD</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        </header>

        <main>
          {/* API Status Notice */}
          <section style={{ 
            border: '2px solid #28a745', 
            padding: '15px', 
            marginBottom: '20px',
            backgroundColor: '#d4edda'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ API Status Update</h3>
            <p style={{ margin: '0', fontSize: '14px', color: '#155724' }}>
              <strong>Dashboard API:</strong> Now working! Usage statistics are loaded from the backend. 
              User registration and video analysis may still have authentication issues that need backend team attention.
            </p>
          </section>

          {/* Analysis Form */}
          <section style={{ border: '1px solid black', padding: '20px', marginBottom: '30px' }}>
            <h2>Analyze TikTok Video</h2>
            <form onSubmit={handleAnalyzeVideo}>
              <p>
                <label htmlFor="videoUrl"><strong>TikTok Video URL:</strong></label><br />
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
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
              <h2>Analysis Results</h2>
              <div style={{ 
                border: '1px solid black', 
                padding: '15px', 
                backgroundColor: '#f9f9f9',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {currentAnalysis}
              </div>
            </section>
          )}

          {/* Usage Stats */}
          <section style={{ border: '1px solid black', padding: '20px' }}>
            <h2>Usage Statistics</h2>
            <div style={{ 
              background: '#d4edda', 
              border: '1px solid #c3e6cb', 
              padding: '10px', 
              marginBottom: '15px',
              color: '#155724'
            }}>
              <small><strong>Live Data:</strong> Usage statistics are now loaded from the backend API in real-time.</small>
            </div>
            {dashboardLoading ? (
              <p>Loading usage statistics...</p>
            ) : dashboardError ? (
              <div style={{ 
                border: '1px solid #ff4444', 
                padding: '10px', 
                backgroundColor: '#ffe6e6',
                color: '#cc0000'
              }}>
                <p><strong>Error loading dashboard data:</strong> {dashboardError}</p>
                <button 
                  onClick={fetchDashboardData}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#cc0000', 
                    color: 'white', 
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
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
              <p>No dashboard data available</p>
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
