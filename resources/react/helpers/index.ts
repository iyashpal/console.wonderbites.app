import axios from 'axios'
import Cookies from 'js-cookie'

export function classNames(...classes) {
  return { className: classes.filter(Boolean).join(' ') }
}


export function flash(key, defaultValue = null) {
  if (defaultValue === null) {
    let state = Cookies.get(key)
    Cookies.remove(key)
    return state
  }

  Cookies.set(key, defaultValue)
}


export function Axios(config = {}) {

  let options = { baseURL: '/core' }

  if (Cookies.get('token')) {
    Object.assign(options, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
      }
    })
  }

  return axios.create({ ...options, ...config })
}
