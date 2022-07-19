/*
|--------------------------------------------------------------------------
| Inertia Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Inertia from '@ioc:EidelLev/Inertia'

Inertia.share({
  errors: (ctx) => {
    // Return empty error object if there are no errors
    if (!ctx.session.flashMessages.has('errors')) {
      return {}
    }

    return resolveValidationErrors(ctx.session.flashMessages.get('errors'))
  },
}).version(() => Inertia.manifestFile('public/assets/manifest.json'))

/**
 * Get the resolved validation errors.
 * 
 * @param validationErrors Form validation errors.
 * @returns {Object}
 */
function resolveValidationErrors (validationErrors: Object) {
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
