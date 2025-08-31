// Use proxy in development and production
const API_BASE_URL = ''



interface AnalysisResponse {
  message: string
  jobId: string
  status: 'cached' | 'queued'
  resultId?: string
  resultAnalysis?: string
  queuePosition?: number
  estimatedWait?: string
}

interface AnalysisStatusResponse {
  id: string
  userId: string | null
  type: string
  url: string
  status: 'PENDING' | 'PROCESSING' | 'CACHED' | 'COMPLETED' | 'FAILED'
  videoResultId: string | null
  errorMessage: string | null
  processingTimeMs: number
  createdAt: string
  updatedAt: string
  startedAt: string | null
  completedAt: string | null
  result?: {
    id: string
    tiktokVideoId: string
    analysisResult: string
    analysisMetadata: any
    processingTime: number
    createdAt: string
  }
}

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

export class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Zlyzer-Frontend/1.0'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  async submitAnalysisRequest(videoUrl: string, customPrompt?: string): Promise<AnalysisResponse> {
    const requestBody: { videoUrl: string; customPrompt?: string } = { videoUrl }
    if (customPrompt?.trim()) {
      requestBody.customPrompt = customPrompt.trim()
    }
    
    const response = await fetch(`${API_BASE_URL}/api/analysis-requests/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit analysis request')
    }

    return response.json()
  }

  async getAnalysisStatus(requestId: string): Promise<AnalysisStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/api/analysis-requests/${requestId}`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Analysis request not found')
      }
      throw new Error('Failed to get analysis status')
    }

    return response.json()
  }

  async signUpUser(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to sign up user')
    }

    return response.json()
  }

  async getDashboardData(): Promise<DashboardData> {
    if (!this.token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorDetails = 'Unknown error'
      try {
        const errorBody = await response.text()
        errorDetails = errorBody
      } catch (e) {
        // Ignore error reading response body
      }

      if (response.status === 401) {
        throw new Error(`Unauthorized - please log in again. Details: ${errorDetails}`)
      }
      if (response.status === 422) {
        throw new Error(`Validation error: ${errorDetails}`)
      }
      throw new Error(`Failed to fetch dashboard data (${response.status}): ${errorDetails}`)
    }

    return response.json()
  }
}

export const apiService = new ApiService()
