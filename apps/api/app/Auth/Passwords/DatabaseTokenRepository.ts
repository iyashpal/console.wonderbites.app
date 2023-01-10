import { DateTime } from 'luxon'
import { User } from 'App/Models'
import { createHash } from 'crypto'
import { string } from '@ioc:Adonis/Core/Helpers'
import PasswordReset from 'App/Models/PasswordReset'

export default class DatabaseTokenRepository {
  /**
   * Create a new token.
   * 
   * @param user 
   * 
   *  @returns {string}
   */
  public async create (user: User) {
    await this.deleteExisting(user)

    // We will create a new, random token for the user so that we can e-mail them
    // a safe link to the password reset form. Then we will insert a record in
    // the database so that we can verify the token within the actual reset.
    const token = this.createNewToken()

    await PasswordReset.create({ token: token, email: user.email })

    return token
  }

  /**
   * Determine if a token record exists and is valid.
   * 
   * @param user 
   * @param token 
   * 
   *  @returns {boolean}
   */
  public async exists (user: User, token: string) {
    const record = await PasswordReset.query()
      .where('email', user.email)
      .where('token', token)
      .first()

    if (record) {
      return !this.tokenExpired(record.created_at)
    }

    return false
  }

  /**
   * Determine if the given user recently created a password reset token.
   * 
   * @param user 
   * 
   *  @returns {boolean}
   */
  public async recentlyCreatedToken (user: User) {
    const token = await PasswordReset.findBy('email', user.email)

    if (token) {
      return this.tokenRecentlyCreated(token.created_at)
    }

    return false
  }

  /**
   * Create a new token for the user.
   *
   * @return string
   */
  public createNewToken () {
    return createHash('sha256').update(string.generateRandom(32)).digest('hex')
  }

  /**
   * Delete all existing reset tokens from the database.
   *
   * @param  user
   * 
   * @returns {void}
   */
  protected async deleteExisting (user: User) {
    await PasswordReset.query().where('email', user.email).delete()
  }

  /**
   * Determine if the token has expired.
   *
   * @param created_at
   * 
   * @return bool
   */
  protected tokenExpired (created_at: DateTime) {
    return DateTime.now() > created_at
  }

  /**
   * Determine if the token was recently created.
   *
   * @param  created_at
   * @return bool
   */
  protected tokenRecentlyCreated (created_at: DateTime): boolean {
    return DateTime.now() < created_at
  }

  /**
   * Delete a token record.
   * 
   * @param user 
   */
  public async delete (user: User) {
    await this.deleteExisting(user)
  }

  /**
   * Delete expired tokens.
   * 
   * @returns {void}
   */
  public async deleteExpired () {
    const expiredAt = DateTime.now().plus({ hour: 1 })

    await PasswordReset.query().where('created_at', '<', expiredAt.toISO()).delete()
  }
}
