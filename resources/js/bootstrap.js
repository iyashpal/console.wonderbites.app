
window.axios = require('redaxios')

window.csrf = document.querySelector('meta[name="csrf"]').getAttribute('content')

// window.axios.defaults = {
//     headers: {
//         common: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     },
//     withCredentials: true
// }
