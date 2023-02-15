export default interface Ingredient {
  id: number,

  name: string,

  unit: string,

  quantity: number,

  minQuantity: number,

  maxQuantity: number,

  price: number,

  thumbnailUrl: string,

  status: string,
}
