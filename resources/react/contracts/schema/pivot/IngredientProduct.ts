import { Ingredient } from './../'
export default interface IngredientProduct extends Omit<Ingredient, 'meta'>{
  meta: {
    pivot_id: number,
    pivot_product_id: number,
    pivot_ingredient_id: number,
    pivot_price: number,
    pivot_max_quantity: number,
    pivot_min_quantity: number,
    pivot_quantity: number,
    pivot_is_locked: boolean,
    pivot_is_required: boolean,
    pivot_is_optional: boolean,
    pivot_created_at: string,
    pivot_updated_at: string
  }
}
