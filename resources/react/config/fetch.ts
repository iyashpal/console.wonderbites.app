import Axios from 'redaxios'
import Cookies from 'js-cookie'

Axios.defaults.baseURL = '/core'
Axios.defaults.headers = {
  'Authorization': `Bearer ${Cookies.get('token')}`,
}
