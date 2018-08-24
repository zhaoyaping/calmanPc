import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login'
import Topleft from '@/components/Topleft'
import Map from '@/page/map'
import Monitor from '@/page/monitor'
import Project from '@/page/project'
import Password from '@/page/password'
import Adduser from '@/page/adduser'
import ManageUser from '@/page/manageuser'
import addProject from '@/page/addProject'
import WebSet from '@/page/WebSet'
import Prompt from '@/page/prompt'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    // 登录界面
    {
      path: '/Login',
      component: Login
    },
    // 提示界面
    {
      path: '/Prompt',
      component: Prompt
    },
    // 大框架
    {
      path: '/Topleft',
      name: 'Topleft',
      component: Topleft,
      redirect: 'map',
      children: [
        // 地图界面
        {
          path: '/map',
          component: Map
        },
        // 新增项目
        {
          path: '/addProject',
          name: 'addProject',
          component: addProject
        },
        // 项目管理
        {
          path: '/project',
          component: Project
        },
        // 监控
        {
          path: '/monitor',
          name: 'Monitor',
          component: Monitor
        },
        // 修改密码
        {
          path: '/password',
          component: Password
        },
        // 新增客户
        {
          path: '/adduser',
          name: 'Adduser',
          component: Adduser
        },
        // 客户管理
        {
          path: '/manageuser',
          component: ManageUser
        },
        //网站设置
        {
          path: '/webSet',
          component: WebSet
        }
      ]
    }
  ]
})
