import Category from "./Category";

export default interface Product {
  id: number,

  name: string,

  description: string,

  price: number,

  sku: string,

  thumbnail_url: string,

  status: number,

  categories?: Category[],

  meta: {
    media_count?: number
  }
}
