import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateValidator {
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

    first_name: schema.string({ trim: true }),

    last_name: schema.string({ trim: true }),

    mobile: schema.string({ trim: true }, [
      // rules.mobile({ strict: true }),
      rules.unique({ table: 'users', column: 'mobile' }),
    ]),

    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    image_path: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'],
    }),

    password: schema.string({ trim: true }, [
      rules.confirmed(),
    ]),

    address_id: schema.number.optional(),

    remember_me_token: schema.string.optional({ trim: true }),

    status: schema.number.optional(),
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
    'first_name.required': 'First name is required.',
    'last_name.required': 'Last name is required.',
    'mobile.required': 'Mobile no. is required.',
    'mobile.mobile': 'Enter a correct mobile no.',
    'mobile.unique': 'The mobile no. already registered.',
    'email.required': 'Email address is required.',
    'email.email': 'Enter a valid email.',
    'email.max_length': 'Email field length shouldn\'t exceed 255 characters.',
    'email.unique': 'The email address already taken.',
    'password.required': 'Choose a password.',
    'password.confirmed': 'Password didn\'t match.',
  }
}
