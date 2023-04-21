/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  // Server
  HOST: Env.schema.string({format: 'host'}),
  PORT: Env.schema.number(),

  // Application
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string(),

  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local', 'gcs'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  // Database connection
  DB_CONNECTION: Env.schema.string(),
  // MySQL database
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),
  //SMS service for OTP
  SMS_USERNAME: Env.schema.string(),
  SMS_PASSWORD: Env.schema.string(),
  // Redis
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({format: 'host'}),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  // SMTP Mailer
  SMTP_HOST: Env.schema.string({format: 'host'}),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string.optional(),
  // Google Cloud Drive
  GCS_KEY_FILENAME: Env.schema.string(),
  GCS_BUCKET: Env.schema.string(),
})
