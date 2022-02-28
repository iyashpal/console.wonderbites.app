import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
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

    first_name: schema.string({ trim: true }),

    last_name: schema.string({ trim: true }),

    mobile: schema.string({ trim: true }, [
      rules.mobile(),
      // rules.unique({ table: 'users', column: "mobile" })
    ]),

    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      // rules.unique({ table: 'users', column: "email" })
    ]),
    image_path: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', "GIF"]
    }),
    password: schema.string({ trim: true }),
    address_id: schema.number(),
    remember_me_token: schema.string({ trim: true }),
    status: schema.number()
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
  public messages = {}
}
