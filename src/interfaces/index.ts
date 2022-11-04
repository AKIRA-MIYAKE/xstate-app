export interface Shop {
  id: string
  name: string
  menus: Menu[]
}

export interface Menu {
  id: string
  name: string
  price: number
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
}
