import Axios from 'axios'
import Cookies from 'js-cookie'

Axios.defaults.baseURL = '/core'

if (Cookies.get('token')) {

    Axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`

}
