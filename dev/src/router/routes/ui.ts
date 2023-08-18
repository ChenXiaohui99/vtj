export const ui = [
  {
    path: '/ui/startup',
    component: () => import('@/views/ui/startup.vue')
  },
  {
    path: '/ui/icon',
    component: () => import('@/views/ui/icon.vue')
  },
  {
    path: '/ui/menu',
    component: () => import('@/views/ui/menu.vue')
  },
  {
    path: '/ui/simple-mask',
    component: () => import('@/views/ui/simple-mask.vue')
  },
  {
    path: '/ui/action',
    component: () => import('@/views/ui/action.vue')
  },
  {
    path: '/ui/action-bar',
    component: () => import('@/views/ui/action-bar.vue')
  },
  {
    path: '/ui/container',
    component: () => import('@/views/ui/container.vue')
  },
  {
    path: '/ui/header',
    component: () => import('@/views/ui/header.vue')
  },
  {
    path: '/ui/panel',
    component: () => import('@/views/ui/panel.vue')
  },
  {
    path: '/ui/directives',
    component: () => import('@/views/ui/directives.vue')
  },
  {
    path: '/ui/dialog',
    component: () => import('@/views/ui/dialog.vue')
  }
];
