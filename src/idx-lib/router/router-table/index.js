import * as errorViews from '../../views/error'
import * as normalViews from '../../views/normal'
console.log(normalViews)
const errorTable = [
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

const normalTable = [
]

const idxRouterTable = errorTable.concat(normalTable)

export default idxRouterTable
