import {Cart} from 'App/Models'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {AddressFactory, CartFactory, CouponFactory, ProductFactory, UserFactory} from 'Database/factories'

test.group('API [checkout.process]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('un-authenticated user can access process checkout.', async ({client, route}) => {
    const cart = await CartFactory.create()
    const address = await AddressFactory.with('user').create()

    const $response = await client.post(route('api.checkouts.process', cart)).json({
      orderType: 'delivery',
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      street: address.street,
      city: address.city,
      location: address.location,
      paymentMode: 'COD',
      channel: 'console',
      options: {},
    })

    $response.assertStatus(200)
    $response.assertBodyContains({id: cart.id})
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('authenticated user can process checkout.', async ({client, route}) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const [address] = user.addresses

    const coupon = await CouponFactory.create()

    await user.cart.merge({couponId: coupon.id}).save()

    const $response = await client.post(route('api.checkouts.process', user.cart))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        orderType: 'delivery',
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        note: 'Test note for the order',
        location: address.location,
        paymentMode: 'COD',
        channel: 'console',
      })

    $response.assertStatus(200)

    $response.assertBodyContains({
      order_type: 'delivery',
      first_name: address.firstName,
      last_name: address.lastName,
      street: address.street,
      city: address.city,
      email: address.email,
      phone: address.phone,
      payment_mode: 'COD',
      note: 'Test note for the order',
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('it reads {statusCode} status code {situation}.')
    .with([
      {
        statusCode: 422,
        situation: 'when "firstName" is missing in payload',
        fields: {firstName: null},
        assert: {
          errors: {
            firstName: 'required validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "lastName" is missing in payload',
        fields: {lastName: null},
        assert: {
          errors: {
            lastName: 'required validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "OrderType" is "delivery" and "street" is missing in payload',
        fields: {street: null},
        assert: {
          errors: {
            street: 'requiredWhen validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "OrderType" is "delivery" and "city" is missing in payload',
        fields: {city: null},
        assert: {
          errors: {
            city: 'requiredWhen validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "OrderType" is "delivery" and "city" and "street" both are missing in payload',
        fields: {city: null, street: null},
        assert: {
          errors: {
            city: 'requiredWhen validation failed',
            street: 'requiredWhen validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "phone" is missing in payload',
        fields: {phone: null},
        assert: {
          errors: {
            phone: 'required validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when "email" is missing in payload',
        fields: {email: null},
        assert: {
          errors: {
            email: 'required validation failed',
          },
        },
      },
      {
        statusCode: 200,
        situation: 'when "location" is missing in payload',
        fields: {location: undefined},
        assert: {location: undefined},
      },
      {
        statusCode: 200,
        situation: 'when "location" lat and lng is empty in payload',
        fields: {location: {lat: null, lng: null}},
        assert: {location: {}},
      },
      {
        statusCode: 200,
        situation: 'when "location" lat and lng is missing in payload',
        fields: {location: {}},
        assert: {location: {}},
      },
      {
        statusCode: 422,
        situation: 'when "paymentMode" is missing in payload',
        fields: {paymentMode: null},
        assert: {
          errors: {
            paymentMode: 'required validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when orderType is missing in payload',
        fields: {orderType: ''},
        assert: {
          errors: {
            orderType: 'required validation failed',
          },
        },
      },
      {
        statusCode: 422,
        situation: 'when orderType is not "dine-in", "take-away" or "delivery"',
        fields: {orderType: 'demo'},
        assert: {
          errors: {
            orderType: 'enum validation failed',
          },
        },
      },
      {
        statusCode: 200,
        situation: 'when orderType is "delivery"',
        fields: {orderType: 'delivery'},
        assert: {
          order_type: 'delivery',
        },
      },
      {
        statusCode: 200,
        situation: 'when orderType is "take-away"',
        fields: {orderType: 'take-away', eatOrPickupTime: '5:00'},
        assert: {
          order_type: 'take-away',
        },
      },
      {
        statusCode: 422,
        situation: 'when orderType is "take-away" and "eatOrPickupTime" is missing',
        fields: {orderType: 'take-away'},
        assert: {
          errors: {eatOrPickupTime: 'requiredWhen validation failed'},
        },
      },
      {
        statusCode: 422,
        situation: 'when orderType is "dine-in" and "reservedSeats" is missing',
        fields: {orderType: 'dine-in', eatOrPickupTime: '5:00'},
        assert: {
          errors: {reservedSeats: 'requiredWhen validation failed'},
        },
      },
      {
        statusCode: 422,
        situation: 'when orderType is "dine-in" and "reservedSeats" and "eatOrPickupTime" both is missing',
        fields: {orderType: 'dine-in'},
        assert: {
          errors: {
            reservedSeats: 'requiredWhen validation failed',
            eatOrPickupTime: 'requiredWhen validation failed',
          },
        },
      },
      {
        statusCode: 200,
        situation: 'when orderType is "dine-in" and "reservedSeats" and "eatOrPickupTime" is not missing',
        fields: {orderType: 'dine-in', reservedSeats: 5, eatOrPickupTime: '5:00'},
        assert: {
          order_type: 'dine-in', reserved_seats: 5, eat_or_pickup_time: '5:00',
        },
      },
      {
        statusCode: 200,
        situation: 'when note is empty or null in payload',
        fields: {note: null},
        assert: {note: undefined},
      },
      {
        statusCode: 200,
        situation: 'when note is having some data in payload',
        fields: {note: 'This is the demo testing of note field.'},
        assert: {note: 'This is the demo testing of note field.'},
      },
      {
        statusCode: 200,
        situation: 'when the order data is accurate in the payload',
        fields: {},
        assert: {
          order_type: 'delivery',
          payment_mode: 'COD',
        },
      },
    ])
    .run(async ({client, route}, {statusCode, fields, assert}) => {
      const user = await UserFactory.with('cart').with('addresses').create()

      const [address] = user.addresses

      const product = await ProductFactory
        .with('ingredients', 3, query => query.with('categories', 1))
        .with('categories', 1).create()

      const coupon = await CouponFactory.create()

      let data = [{
        id: product.id,
        category: product.categories[0].id,
        quantity: 1,
        ingredients: product.ingredients.map(item => {
          return {
            id: item.id,
            category: item.categories[0].id,
            quantity: 1,
          }
        }),
      }]
      await user.cart.merge({couponId: coupon.id, data: data}).save()

      let payload = {
        orderType: 'delivery',
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        location: address.location,
        paymentMode: 'COD',
        channel: 'console',
        options: {},
      }

      const $response = await client.post(route('api.checkouts.process', user.cart))
        .guard('api').loginAs(user).json(Object.assign(payload, fields))

      if (statusCode !== $response.status()) {
        $response.dumpBody()
      }

      $response.assertStatus(statusCode)

      $response.assertBodyContains(assert)
    }).tags(['@api', '@api.checkout', '@api.checkouts.process', '@api.checkouts.debug'])

  test('it can delete the cart on order creation from the referenced cart.', async ({client, route, assert}) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({couponId: coupon.id}).save()

    const [address] = user.addresses

    const qs = {with: ['checkout.products', 'checkout.user']}

    const $response = await client.post(route('api.checkouts.process', user.cart, {qs}))
      .guard('api').loginAs(user).json({
        orderType: 'delivery',
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        location: address.location,
        paymentMode: 'COD',
        channel: 'console',
        options: {},
      })

    const cart = await Cart.query().where('id', user.cart.id).first()

    assert.isUndefined(cart?.id)

    $response.assertStatus(200)

    $response.assertBodyContains({
      user_id: user.id,
      payment_mode: 'COD',
      city: address.city,
      email: address.email,
      phone: address.phone,
      street: address.street,
      order_type: 'delivery',
      location: address.location,
      last_name: address.lastName,
      first_name: address.firstName,
      data: JSON.stringify(user.cart.data),
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])
})
