import { User } from 'App/Models'

export default interface TokenRepositoryInterface {
  /**
   * Create a new token.
   * 
   * @param user 
   * 
   *  @returns {string}
   */
  create (user: User): string;

  /**
   * Determine if a token record exists and is valid.
   * 
   * @param user 
   * @param token 
   * 
   *  @returns {boolean}
   */
  exists (user: User, token: string): boolean;

  /**
   * Determine if the given user recently created a password reset token.
   * 
   * @param user 
   * 
   *  @returns {boolean}
   */
  recentlyCreatedToken (user: User): boolean;

  /**
   * Delete a token record.
   * 
   * @param user 
   */
  delete (user: User): void;

  /**
   * Delete expired tokens.
   * @returns {void}
   */
  deleteExpired (): void;
}
