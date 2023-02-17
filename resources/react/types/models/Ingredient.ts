export default interface Ingredient {
  id: number,

  name: string,

  description: string,

  sku: string,

  unit: string,

  quantity: number,

  minQuantity: number,

  maxQuantity: number,

  price: number,

  thumbnailUrl: string,

  publishedAt: string,

  status: string,
}
