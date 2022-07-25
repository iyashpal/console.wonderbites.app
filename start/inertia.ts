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
import { resolveValidationErrors } from 'App/Helpers/Validation'

Inertia.share({
  errors: (ctx) => {
    // Return empty error object if there are no errors
    if (!ctx.session.flashMessages.has('errors')) {
      return {}
    }

    return resolveValidationErrors(ctx.session.flashMessages.get('errors'))
  },
}).version(() => Inertia.manifestFile('public/assets/manifest.json'))
