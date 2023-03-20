import axios from 'axios'
import Cookies from 'js-cookie'
import nProgress from 'nprogress'

/**
 * baseURL: setting base url for axios hits.
 */
axios.defaults.baseURL = '/core'

/**
 * headers: Setup auth token to default configuration.
 */
if (Cookies.get('token')) {

  axios.defaults.headers['Authorization'] = `Bearer ${Cookies.get('token')}`

}


const request = axios.interceptors.request.use(function (config) {
  if (nProgress.isStarted() === false) {

    nProgress.start()

  }

  return config
})

const response = axios.interceptors.response.use(function (response) {
  nProgress.done()
  return response;
})


export default axios
export const interceptors = {request, response}
