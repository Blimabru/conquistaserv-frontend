const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginPageLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('pages/Login.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/RedirectPage.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: 'perfil',
        component: () => import('pages/common/Profile.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: 'beneficios',
        component: () => import('pages/Admin/users/Beneficios.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: 'documentos',
        component: () => import('pages/Admin/users/Documentos.vue'),
        meta: { requiredLogin: true },
      },
      {
        path: 'servicos',
        component: () => import('pages/Admin/users/Servicos.vue'),
        meta: { requiredLogin: true },
      },
      {
        // Rotas administrativas: sempre prefixadas com /admin/*
        path: 'admin',
        meta: { requiredLogin: true, requiredAdminLevel: true },
        children: [
          {
            path: 'dashboard',
            component: () => import('pages/Admin/Dashboard.vue'),
          },
          {
            path: 'usuarios',
            component: () => import('pages/Admin/users/ListUsers.vue'),
          },
          {
            path: 'usuarios/adicionar',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
          {
            path: 'usuarios/editar/:id',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
          {
            path: 'secretarias',
            component: () => import('pages/Admin/secretarias/ListSecretarias.vue'),
          },
          {
            path: 'comunicacao/canais',
            component: () => import('pages/Admin/comunicacao/ListCanais.vue'),
          },
          {
            path: 'comunicacao/publicacoes',
            component: () => import('pages/Admin/comunicacao/ListPublicacoes.vue'),
          },
          {
            path: 'comunicacao/publicacoes/:id/analytics',
            component: () => import('pages/Admin/comunicacao/AnalyticsPublicacao.vue'),
          },
        ],
      },
      {
        // Rotas de usuário comum: nunca prefixadas com /admin
        path: 'inicio',
        meta: { requiredLogin: true },
        children: [
          {
            path: '',
            component: () => import('pages/Admin/Dashboard.vue'),
          },
          {
            path: 'editar/:id',
            component: () => import('pages/Admin/users/UserActionsForm.vue'),
          },
        ],
      },
      {
        path: 'comunicacao',
        meta: { requiredLogin: true },
        children: [
          {
            path: '',
            component: () => import('pages/servidor/comunicacao/FeedComunicacao.vue'),
          },
          {
            path: 'canais/:id',
            component: () => import('pages/servidor/comunicacao/CanalDetalhe.vue'),
          },
          {
            path: 'publicacao/:id',
            component: () => import('pages/servidor/comunicacao/DetalhePublicacao.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/feedback',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiredLogin: true, requiredAdminLevel: true },
    children: [
      {
        path: '',
        name: 'feedbackDashboard',
        component: () => import('pages/Feedback/FeedbackDashboard.vue'),
        meta: { title: 'Métricas e Feedbacks' },
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
