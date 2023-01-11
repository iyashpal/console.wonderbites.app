import Env from '@ioc:Adonis/Core/Env'

export default class Storage {
  public APP_URL: string

  public static instance: Storage

  constructor () {
    this.APP_URL = Env.get('APP_URL')
  }

  public static make () {
    if (Storage.instance instanceof Storage) {
      return Storage.instance
    }

    Storage.instance = new Storage()

    return Storage.instance
  }

  public static public (url = '/') {
    let instance = Storage.make()

    return [
      instance.APP_URL,
      instance.APP_URL.endsWith('/') ? '' : '/',
      url.startsWith('/') ? url.replace('/', '') : `${url}`,
    ].join('')
  }

  public static uploads (url = '/') {
    let instance = Storage.make()

    return [
      instance.APP_URL,
      instance.APP_URL.endsWith('/') ? 'uploads' : '/uploads',
      url.startsWith('/') ? url : `/${url}`,
    ].join('')
  }
}
