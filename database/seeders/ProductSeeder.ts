import { Product, User } from 'App/Models'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class ProductSeederSeeder extends BaseSeeder {
  public async run () {
    // 
    const user = await User.firstOrCreate({ email: 'yash@brandsonify.com' }, {
      firstName: 'Yash',
      lastName: 'Pal',
      mobile: '01234567890',
      password: 'secret',
    })

    await Product.updateOrCreateMany('name', [
      {
        userId: user.id,
        name: 'Salmon Sallad',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '452',
        sku: '001',
      },
      {
        userId: user.id,
        name: 'Chicken Soup Curry',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '453',
        sku: '002',
      },
      {
        userId: user.id,
        name: 'Pizza Margharita',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '454',
        sku: '003',
      },
      {
        userId: user.id,
        name: 'Shrimps Soup',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '455',
        sku: '004',
      },
      {
        userId: user.id,
        name: 'Bacon Burger',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '455',
        sku: '004',
      },
      {
        userId: user.id,
        name: 'Salad Bowl',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '455',
        sku: '004',
      },
      {
        userId: user.id,
        name: 'Coca Cola',
        description: `The beauty of this Salad Bowl is that it is completely customizable. 
        The baked salmon with homemade teriyaki sauce is the star of the show but you can choose how to showcase it. 
        Swap the spinach/carrots/edamame for any of your favorite veggies`,
        price: 500,
        calories: '455',
        sku: '004',
      },
    ])
  }
}
