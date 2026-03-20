import { Boards } from './forum/components/boards/boards';
import { Routes } from '@angular/router';
import { NavbarLayout } from './shared/layouts/navbar-layout/navbar-layout';
import { BlankLayout } from './shared/layouts/blank-layout/blank-layout';

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
  //教練課程路由
  {
    path: 'experience',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./experience/components/index/index').then(m => m.Index),
      },
      {
        path: 'coachisland',
        loadComponent: () => import('./experience/components/coach-island/coach-island').then(m => m.CoachIsland)
      },
      {
        path: 'coachintro',
        loadComponent: () => import('./experience/components/coachintro/coachintro').then(m => m.Coachintro)
      },


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
