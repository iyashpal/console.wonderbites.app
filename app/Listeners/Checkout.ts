import { Order, Product } from 'App/Models'
import type { EventsList } from '@ioc:Adonis/Core/Event'

export default class Checkout {
  public async calculatePrice (order: EventsList['new:order']) {
    if (order.data === null) {
      return
    }

    let data = typeof order.data === 'string' ? JSON.parse(order.data) : order.data

    let products = await Product.query()
      .whereIn('id', data.map(({ id }) => id))
      .preload('categories').preload('ingredients')
      .preload('variants', query => query.preload('categories').preload('ingredients'))

    let overwriteData = data.map(dataProduct => {
      const product = products.find(({ id }) => dataProduct.id === id)
      const variant = product?.variants.find(({ id }) => dataProduct?.variant.id === id)
      return {
        ...dataProduct,
        price: Number(product?.price),
        ...(variant?.id ? {
          variant: {
            ...dataProduct.variant,
            price: Number(variant.price),
            ingredients: dataProduct.variant.ingredients.map(dataIngredient => {
              let ingredient = variant.ingredients.find(({ id }) => id === dataIngredient.id)
              return {
                ...dataIngredient,
                price: ingredient?.$extras.pivot_price,
              }
            }),
          },
        } : {}),
        ...(dataProduct.ingredients ? {
          ingredients: dataProduct.ingredients.map(dataIngredient => {
            const ingredient = product?.ingredients.find(({id}) => id === dataIngredient.id)
            return {
              ...dataIngredient,
              price: Number(ingredient?.$extras.pivot_price),
            }
          }),
        } : {}),
      }
    })

    await Order.query().where('id', order.id).update({ data: JSON.stringify(overwriteData) })
  }
}
