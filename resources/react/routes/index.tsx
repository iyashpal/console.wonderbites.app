import * as Views from '@/routes/views'
import {createBrowserRouter} from 'react-router-dom'

export default createBrowserRouter([
  {
    path: '/',
    element: <Views.IndexView/>
  },

  {
    path: 'about',
    element: <div>This is about page.</div>
  }
])
