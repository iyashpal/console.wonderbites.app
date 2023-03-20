import Cookies from 'js-cookie'
import axios from '@/config/axios'

export function classNames(...classes) {
  return {className: classes.filter(Boolean).join(' ')}
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

  if (Cookies.get('token')) {

    axios.defaults.headers['Authorization'] = `Bearer ${Cookies.get('token')}`

  }

  axios.defaults = {...axios.defaults, ...config}


  return axios
}
