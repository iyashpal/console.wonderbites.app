import {Axios} from '@/helpers'
import {Ingredient, Product} from '@/types/models'
import {IngredientProduct} from '@/types/models/pivot'

export default function useIngredientProduct({product}: { product: Product }) {


  function sync(ingredient: IngredientProduct) {
    return post({
      action: 'attach',
      id: ingredient.id,
      pivot: {
        price: ingredient.meta.pivot_price,
        quantity: ingredient.meta.pivot_quantity,
        is_locked: ingredient.meta.pivot_is_locked,
        is_required: ingredient.meta.pivot_is_required,
        is_optional: ingredient.meta.pivot_is_optional,
        min_quantity: ingredient.meta.pivot_min_quantity,
        max_quantity: ingredient.meta.pivot_max_quantity,
      }
    })
  }

  function attach(ingredient: Ingredient) {
    return post({
      action: 'attach',
      id: ingredient.id,
      pivot: {
        price: ingredient.price,
        quantity: ingredient.quantity,
        min_quantity: ingredient.minQuantity,
        max_quantity: ingredient.maxQuantity,
        is_locked: true,
        is_required: false,
        is_optional: false,
      }
    })
  }

  function detach(detachable: number[] | string[]) {
    return post({action: 'detach', detachable})
  }

  function post(data: object) {
    return Axios().post(`products/${product.id}/ingredient`, data)
  }

  return {
    sync,
    attach,
    detach,
  }
}
