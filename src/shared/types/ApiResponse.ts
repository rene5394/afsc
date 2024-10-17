export interface ApiResponse<T> {
  status: number
  data: T
}

export interface ApiResponseWithMeta<T> {
  status: number
  data: T
  meta: ApiMetaResponse
}

export interface ApiMetaResponse {
  total: number
  totalPages: number
  nextPage: number | null
  currentPage: number
  prevPage: number | null
}
