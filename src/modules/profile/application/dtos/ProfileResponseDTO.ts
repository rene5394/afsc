export type ProfileResponseDTO = {
  id: number
  name: string
  story: string | null
  author: string | null
  photo: string | null
  active: boolean
  createdAt: string
  updatedAt: string | null
  tags: {
    id: number
    name: string
  }[]
  assets: {
    id: number
    url: string
    typeId: number
  }[]
  routes: {
    id: number
    location: string
    latitude: string
    longitude: string
    orderNumber: number
  }[]
  links: {
    id: number
    title: string
    url: string
  }[]
}
