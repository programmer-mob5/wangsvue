import { Component } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/button',
    children: [
      {
        path: 'button',
        name: 'ButtonDocs',
        component: (): Promise<Component> =>
          import('./docs/button/ButtonDocs.vue'),
      },
      {
        path: 'typo',
        name: 'Typography Docs',
        component: (): Promise<Component> =>
          import('./docs/typography/TypographyDocs.vue'),
      },
      {
        path: 'card',
        name: 'Card Docs',
        component: (): Promise<Component> => import('./docs/card/CardDocs.vue'),
      },
      {
        path: 'tabmenu',
        name: 'Tab Menu Docs',
        component: (): Promise<Component> =>
          import('./docs/tabmenu/TabMenuDocs.vue'),
      },
      {
        path: 'menu',
        name: 'Menu Docs',
        component: (): Promise<Component> => import('./docs/menu/MenuDocs.vue'),
      },
      {
        path: 'filtercontainer',
        name: 'Filter Container Docs',
        component: (): Promise<Component> =>
          import('./docs/filtercontainer/FilterContainerDocs.vue'),
      },
      {
        path: 'breadcrumb',
        name: 'Breadcrumb Docs',
        component: (): Promise<Component> =>
          import('./docs/breadcrumb/BreadcrumbDocs.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory((import.meta.env || process.env).BASE_URL),
  routes,
});

export default router;
