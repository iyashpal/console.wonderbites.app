import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JobApplicationValidator {
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
    mobile: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [
      rules.email()
    ]),
    address: schema.string({ trim: true }),
    desired_pay: schema.string({ trim: true }),
    reference_from: schema.string({ trim: true }),
    notice_period: schema.string({ trim: true }),
    agreed_terms_conditions: schema.string({trim:true}),
    status: schema.number(),

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
    'email.required': 'Email address is required.',
    'email.email': 'Enter a valid email.',
    'adddress.required': 'Enter your address',
    'desired_pay.required': 'Enter your desired pay',
    'reference_from.required': 'Enter your reference',
    'notice_period.required': 'Enter your notice period',
    'agreed_terms_conditions.required': 'Please check check and conditions',
  }
}
