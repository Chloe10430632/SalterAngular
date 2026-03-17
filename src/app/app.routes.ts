import { Boards } from './forum/components/boards/boards';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', //首頁
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts),
          }
        ]
      }
    ]
  },
  //討論版路由
  {
    path: 'forum',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts),
          }
        ]
      },
      {
        path: 'posts',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts),
          }
        ]
      },
      {
        path: 'boards',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/boards/boards').then(m => m.Boards)
          }
        ]
      }
    ]
  }
  ,
  {
    path: 'experience',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./experience/components/index/index').then(m => m.Index),
      }
    ]
  },
  {
    path: '**', //萬用路由404
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound),
      }
    ]
  },



];
