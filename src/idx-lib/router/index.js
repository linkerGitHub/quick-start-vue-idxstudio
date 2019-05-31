import * as errorViews from '../views/error'
import * as normalVies from '../views/normal'

const error = [
  {
    path: '/error/401',
    name: 'Err401',
    component: errorViews.Err401
  },
  {
    path: '/error/403',
    name: 'Err403',
    component: errorViews.Err403
  },
  {
    path: '/error/404',
    name: 'Err404',
    component: errorViews.Err404
  },
  {
    path: '/error/500',
    name: 'Err500',
    component: errorViews.Err500
  },
  {
    path: '/error/502',
    name: 'Err502',
    component: errorViews.Err502
  }
]

const normal = [
  {
    path: '/Login',
    name: 'login',
    component: normalVies.Login
  },
  {
    path: '/Logout',
    name: 'logout',
    component: normalVies.Logout
  }
]

export {
  error,
  normal
}
