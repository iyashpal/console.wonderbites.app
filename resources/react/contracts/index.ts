/**
 * API request validation errors.
 */
export type ErrorsType<U> = { [key in keyof U]?: string }
