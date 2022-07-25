/**
 * Get the resolved validation errors.
 * 
 * @param validationErrors Form validation errors.
 * @returns {Object}
 */
export function resolveValidationErrors (validationErrors: Object) {
  const errors = {}

  for (let i in validationErrors) {
    if (typeof validationErrors[i] === 'object') {
      errors[i] = Object.values(validationErrors[i])[0]
    }

    if (typeof validationErrors[i] === 'string') {
      errors[i] = validationErrors[i]
    }
  }

  return errors
}
