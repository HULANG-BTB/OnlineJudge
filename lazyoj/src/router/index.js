// 路由文件 router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Index',
      component: () => import("@/view/index/layout"),
      children: [
        {
          path: '/Index/Index',
          component: () => import('@/view/index/index/index'),
          children: [
            {
              path: '/Index/Index/Info',
              component: () => import('@/view/index/index/info')
            },
            {
              path: '/Index/Index',
              redirect: '/Index/Index/Info'
            }
          ]
        },
        {
          path: '/Index/Env',
          component: () => import('@/view/index/env/env'),
          children: [
            {
              path: '/Index/Env/Index',
              component: () => import('@/view/index/env/index')
            }
          ]
        },
        {
          path: '/Index/Problem',
          component: () => import('@/view/index/problem/problem'),
          children: [
            {
              path: '/Index/Problem/List',
              component: () => import('@/view/index/problem/list')
            },
            {
              path: '/Index/Problem/Detail',
              component: () => import('@/view/index/problem/detail'),
            },
            {
              path: '/Index/Problem/Submit',
              component: () => import('@/view/index/problem/submit'),
            }
          ]
        },
        {
          path: '/Index/Status',
          component: () => import('@/view/index/status/status'),
          children: [
            {
              path: '/Index/Status/List',
              component: () => import('@/view/index/status/list')
            }
          ]
        },
        {
          path: '/Index/Rank',
          component: () => import('@/view/index/rank/rank'),
          children: [
            {
              path: '/Index/Rank/List',
              component: () => import('@/view/index/rank/list')
            }
          ]
        },
        {
          path: '/Index/Contest',
          component: () => import('@/view/index/contest/contest'),
          children: [
            {
              path: '/Index/Contest/List',
              component: () => import('@/view/index/contest/list')
            },
            {
              path: '/Index/Contest/Detail',
              component: () => import('@/view/index/contest/detail')
            },
            {
              path: '/Index/Contest/Problem',
              component: () => import('@/view/index/contest/problem')
            },
            {
              path: '/Index/Contest/Submit',
              component: () => import('@/view/index/contest/submit')
            },
            {
              path: '/Index/Contest/Status',
              component: () => import('@/view/index/contest/status')
            },
            {
              path: '/Index/Contest/Rank',
              component: () => import('@/view/index/contest/rank')
            }
          ]
        },
        {
          path: '/Index/User',
          component: () => import('@/view/index/user/user'),
          children: [
            {
              path: '/Index/User/Register',
              component: () => import('@/view/index/user/register'),
            },
            {
              path: '/Index/User/Info',
              component: () => import('@/view/index/user/info'),
            },
            {
              path: '/Index/User/Statics',
              component: () => import('@/view/index/user/statics'),
            },
          ]
        },
        {
          path: '',
          redirect: './Index'
        },
        {
          path: '*',
          redirect: '/Index'
        }
      ]
    },
    {
      path: '/Admin',
      component: () => import('@/view/admin/layout'),
      children: [
        {
          path: '/Admin/Index',
          component: () => import('@/view/admin/index/index')
        },
        {
          path: '/Admin/Normal',
          component: () => import('@/view/admin/normal/normal'),
          children: [
            {
              path: "/Admin/Normal/Notice",
              component: () => import('@/view/admin/normal/notice')
            },
            {
              path: "/Admin/Normal/News",
              component: () => import('@/view/admin/normal/news')
            },
            {
              path: "/Admin/Normal/addNews",
              component: () => import('@/view/admin/normal/addNews')
            }
          ]
        },
        {
          path: '/Admin/Problem',
          component: () => import('@/view/admin/problem/problem'),
          children: [
            {
              path: '/Admin/Problem/List',
              component: () => import('@/view/admin/problem/list')
            },
            {
              path: '/Admin/Problem/Add',
              component: () => import('@/view/admin/problem/add')
            },
            {
              path: '/Admin/Problem/Judge',
              component: () => import('@/view/admin/problem/judge')
            },
            {
              path: '/Admin/Problem/Import',
              component: () => import('@/view/admin/problem/import')
            },
            {
              path: '/Admin/Problem/Export',
              component: () => import('@/view/admin/problem/export')
            }
          ]
        },
        {
          path: '/Admin/Contest',
          component: () => import('@/view/admin/contest/contest'),
          children: [
            {
              path: '/Admin/Contest/List',
              component: () => import('@/view/admin/contest/list')
            },
            {
              path: '/Admin/Contest/Add',
              component: () => import('@/view/admin/contest/add')
            }
          ]
        },
        {
          path: '/Admin/User',
          component: () => import('@/view/admin/user/user'),
          children: [
            {
              path: '/Admin/User/List',
              component: () => import('@/view/admin/user/list')
            },
            {
              path: '/Admin/User/Privilege',
              component: () => import('@/view/admin/user/privilege')
            }
          ]
        },
        {
          path: '',
          redirect: '/Admin/Index'
        },
        {
          path: '*',
          redirect: '/Admin/Index'
        }
      ]
    },
    {
      path: '',
      redirect: './Index'
    }
  ]
})
