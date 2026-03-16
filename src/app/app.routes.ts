import { Boards } from './forum/components/boards/boards';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', //首頁
    loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts)
      }
    ]
  },
  //討論版路由
  {
    path: 'forum',
    loadComponent: () => import('./forum/components/index/index').then(m => m.Index), //先套用 Main 組件，裡面再套用 Index 組件
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts)
      },
      {
        path: 'posts',
        loadComponent: () => import('./forum/components/posts/posts').then(m => m.Posts)
      },
      {
        path: 'boards',
        loadComponent: () => import('./forum/components/boards/boards').then(m => m.Boards)
      },
      {
        path: '**', //導到 NotFound
        loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound)
      }
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
    path: '**', //404 Not Found
    loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound)
  },



];
