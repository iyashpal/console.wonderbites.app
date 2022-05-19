import { Product, User } from 'App/Models'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class ProductSeederSeeder extends BaseSeeder {
  public async run () {
    const user = await User.firstOrCreate({ email: 'yash@brandsonify.com' }, {
      firstName: 'Yash',
      lastName: 'Pal',
      mobile: '01234567890',
      password: 'secret',
    })

    const products = await Product.all()

    const product = await user?.related('products').create({
      name: `Product ${products.length > 0 ? products.length : ''}`,
      description: 'Product Description',
      price: '45.00',
      calories: '452',
      sku: '001',
    })

    product.related('categories').create({})
  }
}
