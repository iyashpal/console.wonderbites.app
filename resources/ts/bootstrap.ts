
window.axios = require('redaxios')

if (document.querySelector('meta[name="csrf"]')) {
  window.csrf = document.querySelector('meta[name="csrf"]').getAttribute('content')
}

// window.axios.defaults = {
//     headers: {
//         common: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     },
//     withCredentials: true
// }
