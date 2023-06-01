import Builder from './Builder'
import OrderBuilder from './OrderBuilder'
import BannerBuilder from './BannerBuilder'
import ProductBuilder from './ProductBuilder'
import CategoryBuilder from './CategoryBuilder'
import { string } from '@ioc:Adonis/Core/Helpers'
import { RequestContract } from '@ioc:Adonis/Core/Request'

type BuildersNameType =
| 'Order'
| 'Banner'
| 'Product'
| 'Category'

export function builder (name: BuildersNameType, request: RequestContract, prefix?: string) {
  return new {
    OrderBuilder,
    BannerBuilder,
    ProductBuilder,
    CategoryBuilder,
  }[`${string.capitalCase(name)}Builder`](request, prefix)
}

export {
  Builder,
  OrderBuilder,
  BannerBuilder,
  ProductBuilder,
  CategoryBuilder,
}
