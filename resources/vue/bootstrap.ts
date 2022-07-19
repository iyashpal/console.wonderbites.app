declare global {
  interface Window {
    axios: any;
    csrf: any
  }
}

import axios from 'redaxios'
window.axios = axios

const CsrfMeta = document.querySelector('meta[name="csrf"]')

if (CsrfMeta) {
  window.csrf = CsrfMeta.getAttribute('content')
}

// window.axios.defaults = {
//     headers: {
//         common: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     },
//     withCredentials: true
// }
