const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/RedirectPage.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: '/perfil',
        component: () => import('pages/common/Profile.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: '/admin/',
        meta: { requiredLogin: true, requiredAdminLevel: true },
        children: [
          {
            path: '',
            component: () => import('pages/Admin/Dashboard.vue'),
          },
          {
            path: '/usuarios',
            component: () => import('pages/Admin/users/ListUsers.vue'),
          },
          {
            path: '/usuarios/adicionar',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
          {
            path: '/usuarios/editar/:id',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
        ],
      },
      {
        path: '/usuario/',
        meta: { requiredLogin: true },
        children: [
          {
            path: '',
            component: () => import('pages/user/HomeUser.vue'),
          },
          {
            path: '/editar/:id',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
        ],
      },
    ],
  },
  {
    name: 'error',
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
