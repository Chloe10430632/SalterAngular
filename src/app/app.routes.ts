import { Routes } from '@angular/router';
import { NavbarLayout } from './shared/layouts/navbar-layout/navbar-layout';
import { BlankLayout } from './shared/layouts/blank-layout/blank-layout';

export const routes: Routes = [
  {
    path: '', //首頁
    component: NavbarLayout, //只要網址是空字串（首頁），就先把 NavbarLayout 這個組件搬出來。
    children: [
      {
        path: '', //因為小孩的 path 也是 ''，所以當你進入首頁時，它會自動抓到小孩。
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/index/index').then(m => m.Index)
          }],
      }
    ]

  },

  //討論版路由
  {
    path: 'forum',
    // loadComponent: () => import('./forum/component/index/index').then(m => m.Index), 先套用 Main 組件，裡面再套用 Index 組件
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index)
      },
      {
        path: '**', //導到 NotFound
        loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound)
      }
      // {
      //   path: 'boards',
      //   loadComponent: () => import('./forum/component/boards/boards').then(m => m.Boards)
      // },
      // {
      //   path: 'boards/:id',
      //   loadComponent: () => import('./forum/component/board/board').then(m => m.Board)
      // },

    ]
  },
  {
    path: 'experience',
    children: [
      {
        path: '', //預設路由
        loadComponent: () => import('./experience/components/index/index').then(m => m.Index)
      },
    ]
  },

  {
    path: 'login',
    component: BlankLayout,
    children: [
      {
        path: '', //預設路由
        loadComponent: () => import('./user/components/login/login').then(m => m.Login)
      },
    ]
  },
  {
    path: 'register',
    loadComponent: () => import('./user/components/register/register').then(m => m.Register)
  },

  {
    path: '**', //404 Not Found
    loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound)
  },





];
