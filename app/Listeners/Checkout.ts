import type { EventsList } from '@ioc:Adonis/Core/Event'
import { Product } from 'App/Models'

export default class Checkout {
  public async calculatePrice (order: EventsList['new:order']) {
    if (order.data === null) {
      return
    }

    let data = typeof order.data === 'string' ? JSON.parse(order.data) : order.data

    let products = await Product.query()
      .whereIn('id', data.map(({id}) => id))
      .preload('categories').preload('ingredients')
      .preload('variants', query => query.preload('categories').preload('ingredients'))

    let overwritten = data.map(dataProduct => {
      const product = products.find(({ id }) => dataProduct.id === id)
      const variant = product?.variants.find(({id}) => dataProduct?.variant.id === id)

      return {
        id: dataProduct.id,
        quantity: dataProduct.quantity,
        price: Number(product?.price),
        ...(variant?.id ? {
          variant: {
            id: variant.id,
            price: Number(variant.price),
            ingredients: dataProduct.variant.ingredients.map(dataIngredient => {
              let ingredient = variant.ingredients.find(({id}) => id === dataIngredient.id)
              return {
                ...dataIngredient,
                price: ingredient?.$extras.pivot_price,
              }
            }),
          },
        } : {}),
      }
    })

    console.log(overwritten)
  }
}
