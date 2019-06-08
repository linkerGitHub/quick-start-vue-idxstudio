import Vue from 'vue'
import Router from 'vue-router'
import * as idxRouter from './idx-lib/router'
import AdminFramework from '@/idx-lib/views/normal/AdminFramework'
import NewActivity from '@/views/NewActivity'
import ActivityList from '@/views/ActivityList'
import InputFieldList from "@/views/InputFieldList";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      name: 'home',
      component: AdminFramework,
      children: [
        {
          path: 'newActivity',
          name: 'newActivity',
          component: NewActivity
        },
        {
          path: 'activityList',
          name: 'activityList',
          component: ActivityList
        },
        {
          path: 'formItemList',
          name: 'formItemList',
          component: InputFieldList
        }
      ]
    }
  ].concat(idxRouter.error).concat(idxRouter.normal)
})
