import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', //首頁
    loadComponent: () => import('./forum/components/index/index').then(m => m.Index)
  },
  {
    path: '**', //404 Not Found
    loadComponent: () => import('./shared/notfound/notfound').then(m => m.Notfound)
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
  //房屋路由
  {
    path: 'house',
    children: [{
      path: '', //預設路由
      loadComponent: () => import('./house/components/index/index').then(m => m.HomeComponent)
    }]
  },
  {
    path: 'experience',
    children: [
      {
        path: '', //預設路由
        loadComponent: () => import('./experience/components/index/index').then(m => m.Index)
      },
    ]
  }



];
