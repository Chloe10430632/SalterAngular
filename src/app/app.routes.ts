import { Blank } from './shared/layouts/blank/blank';
import { Component } from '@angular/core';
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
      },
      {
        path: 'boards/:id',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/select-board-posts/select-board-posts').then(m => m.SelectBoardPosts)
          }
        ]
      }
    ]
  }
  ,
  //教練課程路由
  {
    path: 'experience', //入口
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./experience/components/index/index').then(m => m.Index),
      },
      {
        path: 'coachisland', //教練功能畫面
        loadComponent: () => import('./experience/components/coach-island/coach-island').then(m => m.CoachIsland)
      },
      {
        path: 'coachdetail', //自介(進入後再用編輯按鈕)
        loadComponent: () => import('./experience/components/coach-detail/coach-detail').then(m => m.CoachDetail)
      },
      {
        path: 'coachcreate', //空白自介
        loadComponent: () => import('./experience/components/coach-create/coach-create').then(m => m.CoachCreate)
      },
      {
        path: 'coachcourse', //教練本人開的課
        loadComponent: () => import('./experience/components/coach-course/coach-course').then(m => m.CoachCourse)
      },
      {
        path: 'coachattend', //報名過的課
        loadComponent: () => import('./experience/components/coach-attend/coach-attend').then(m => m.CoachAttend)
      },
      {
        path: 'coachfav', //收藏
        loadComponent: () => import('./experience/components/coach-favorite/coach-favorite').then(m => m.CoachFavorite)
      },
      {
        path: 'coachprofile', //本人自介
        loadComponent: () => import('./experience/components/coach-profile/coach-profile').then(m => m.CoachProfile)
      },
      {
        path: 'coachintro', //看其他教練介紹
        loadComponent: () => import('./experience/components/coachintro/coachintro').then(m => m.Coachintro)
      },


    ]
  },
  //login路由
  {
    path: 'login',
    component: BlankLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./user/components/login/login').then(m => m.Login),
      },
    ]
  },
  //註冊
  {
    path: 'register',
    component: NavbarLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./user/components/register/register').then(m => m.Register),
      },
    ]
  },
  //忘記密碼
  {
    path: 'ForgotPassword',
    component: NavbarLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./user/components/forgot-password/forgot-password').then(m => m.ForgotPassword),
      },
    ]
  },

  //行程路由
  {
    path: 'trip',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: '',
        loadComponent: () => import('./trip/trip-layout/trip-layout').then(m => m.TripLayout),
        children: [
          {
            path: '',
            redirectTo: 'explore',
            pathMatch: 'full'
          },
          {
            path: 'explore', // 行程探索
            loadComponent: () => import('./trip/components/explore/explore').then(m => m.Explore),
          },
          {
            path: 'create', // 建立行程
            loadComponent: () => import('./trip/components/create-trip/create-trip').then(m => m.CreateTrip),
          },
          {
            path: 'detail/:id',  // 行程詳情
            children: [
              {
                path: 'location',  // 地點頁面
                loadComponent: () => import('./trip/components/location/location').then(m => m.Location),
              }
            ]
          }
        ]
      }
    ]
  },
  //House路由
  {
    path: 'house',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [{
      path: '',
      loadComponent: () => import('./house/components/index/index').then(m => m.Index),
    }]
  },
  {
    path: 'houseDetail/:id',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [{
      path: '',
      loadComponent: () => import('./house/components/detail/detail').then(m => m.Detail),
    }]
  },
  {
    path: 'createHouse',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [{
      path: '',
      loadComponent: () => import('./house/components/create-house/create-house').then(m => m.CreateHouse),
    }]
  },
  {
    path: 'updateHouse/:id',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [{
      path: '',
      loadComponent: () => import('./house/components/update-house/update-house').then(m => m.UpdateHouse),
    }]
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
  }




];
