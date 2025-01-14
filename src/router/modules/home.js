/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-24 19:27:21
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
// home.js
const Layout = () => import('@/layout/index.vue')
const Home = () => import('@/views/home/index.vue')

export default [
  {
    path: '/home',
    component: Layout,
    name: 'Dashboard',
    meta: {
      title: 'menu.dashboard',
    },
    icon: 'icon-home',
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: {
          title: 'menu.homepage',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/item',
    component: Layout,
    name: 'item',
    meta: {
      title: '商品',
    },
    icon: 'icon-home',
    children: [
      {
        path: 'itemWebsite',
        name: 'itemWebiste',
        component: () => import('@/views/item_website/index.vue'),
        meta: {
          title: '网站',
        },
      },
      {
        path: 'itemRegexp/:id',
        name: 'itemRegexp',
        component: () => import('@/views/item_website/regexp.vue'),
        meta: {
          title: '商品匹配正则',
        },
        hidden: true,
      },
      {
        path: '',
        name: 'item',
        component: () => import('@/views/item/index.vue'),
        meta: {
          title: '商品',
        },
      },
    ],
  },
]
