import {Axios} from '@/helpers'
import {Ingredient, Product} from '@/types/models'
import {IngredientProduct} from '@/types/models/pivot'
import {useState} from "react";

export default function useIngredientProductForm({product}: { product: Product }) {
  const [isProcessing, setIsProcessing] = useState(false)

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
    setIsProcessing(true)
    return Axios().post(`products/${product.id}/ingredient`, data)
      .then((data) => {
        setIsProcessing(false)
        return Promise.resolve(data)
      }).catch(error => {
        setIsProcessing(false)
        return Promise.reject(error)
      })
  }

  return {
    sync,
    attach,
    detach,
    isProcessing,
  }
}
