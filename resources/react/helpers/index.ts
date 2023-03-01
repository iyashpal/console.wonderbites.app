import Cookies from 'js-cookie'

export function className(...classes) {
  return {className: classes.filter(Boolean).join(' ')}
}

export const classNames = className

export function flash(key, defaultValue = null) {
  if (defaultValue === null) {
    let state = Cookies.get(key)
    Cookies.remove(key)
    return state
  }

  Cookies.set(key, defaultValue)
}
