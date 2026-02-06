export interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
}

export interface Project extends BaseEntity {
  name: string
  code?: string
  status?: string
}

export interface DashboardStats {
  projects: string
  scenarios: string
  requirements: string
  openGaps: string
  wricefItems: string
  configItems: string
  testCases: string
}
