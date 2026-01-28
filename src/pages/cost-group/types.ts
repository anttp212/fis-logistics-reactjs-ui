/**
 * Cost Group Types
 */

// Entity type
export type CostGroupT = {
  id: string
  code: string
  name: string
  remark: string
  status: 'Active' | 'Inactive'
}

// Filter form values
export type CostGroupFilterT = {
  code: string
  name: string
  remark: string
  status: 'Active' | 'Inactive' | null
}

// API request params
export type CostGroupParamsT = {
  search?: string
  filters?: Partial<CostGroupFilterT>
  sort?: { columnKey?: string; order?: string }
  page?: number
  pageSize?: number
}

// API response
export type CostGroupResponseT = {
  data: CostGroupT[]
  total: number
  page: number
  pageSize: number
}
