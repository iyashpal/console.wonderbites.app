import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class ProcessValidator {
  constructor (protected ctx: HttpContextContract) { }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    cart: schema.number([
      rules.required(),
      rules.exists({ table: 'carts', column: 'id' }),
    ]),
    orderType: schema.enum(['dine-in', 'take-away', 'delivery'] as const),

    firstName: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.maxLength(255),
    ]),
    lastName: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.maxLength(100),
    ]),
    street: schema.string.optional({ trim: true, escape: true }, [
      rules.requiredWhen('orderType', '=', 'delivery'),
      rules.maxLength(150),
    ]),
    city: schema.string.optional({ trim: true, escape: true }, [
      rules.requiredWhen('orderType', '=', 'delivery'),
      rules.maxLength(100),
    ]),
    phone: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.maxLength(15),
    ]),
    email: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.email(),
      rules.maxLength(200),
    ]),
    location: schema.object.optional().members({
      lat: schema.string.optional({ trim: true, escape: true }),
      lng: schema.string.optional({ trim: true, escape: true }),
    }),
    paymentMode: schema.string({ trim: true, escape: true }, [
      rules.required(),
    ]),
    reservedSeats: schema.number.optional([
      rules.requiredWhen('orderType', '=', 'dine-in'),
    ]),
    eatOrPickupTime: schema.string.optional({ trim: true, escape: true }, [
      rules.requiredWhen('orderType', 'in', ['take-away', 'dine-in']),
    ]),
    options: schema.object.optional().anyMembers(),
    note: schema.string.optional({ trim: true, escape: true }),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
