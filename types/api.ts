export interface ApiKeyData {
  id: string
  userId: string
  keyHash: string
  keyPrefix: string
  name: string
  lastUsedAt: string | null
  isActive: boolean
  createdAt: string
}

export interface CreateApiKeyResponse {
  id: string
  key: string // Full key, only shown once
  prefix: string
  name: string
  createdAt: string
}

export interface ApiErrorResponse {
  error: string
  code: string
  message: string
  statusCode: number
}

export interface UsageData {
  currentMonth: {
    checksUsed: number
    checksLimit: number
    percentUsed: number
    checksWeb: number
    checksApi: number
  }
  history: Array<{
    date: string
    checksWeb: number
    checksApi: number
    totalChecks: number
  }>
}

