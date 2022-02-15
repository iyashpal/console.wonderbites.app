import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) { }

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

    first_name: schema.string({ trim: true },
      [
        rules.required
      ]),

    last_name: schema.string({ trim: true }, [
      rules.required
    ]),

    mobile: schema.string({ trim: true },
      [
        rules.mobile(),
        rules.required,
        rules.unique({ table: 'users', column: "mobile" })
      ]),

    email: schema.string({ trim: true },
      [
        rules.required,
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: "email" })
      ]),

    password: schema.string({ trim: true },
      [
        rules.required,
        rules.confirmed()
      ])
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
  public messages = {

    'user.first_name.required': 'First Name is required',
    // 'tags.*.number': 'Tags must be an array of numbers',
    // 'products.*.title.required': 'Each product must have a title'

  }

}
