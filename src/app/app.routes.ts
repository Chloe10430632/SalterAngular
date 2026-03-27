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
        path: 'posts/:id',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: '',
            loadComponent: () => import('./forum/components/post-details/post-details').then(m => m.PostDetails),
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
      }, {
        path: 'member',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: 'wall',
            loadComponent: () => import('./forum/components/personal-wall/personal-wall').then(m => m.PersonalWall),
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
        loadComponent: () => import('./experience/components/coach-index/index').then(m => m.Index),
      },
      //===自己使用(教練定位)===//
      {
        path: 'coachisland', //教練功能畫面
        loadComponent: () => import('./experience/components/coach-island/coach-island').then(m => m.CoachIsland)
      },
      {
        path: 'coachcreate', //空白自介(申請)
        loadComponent: () => import('./experience/myComponents/backdrop/coach-create/coach-create').then(m => m.CoachCreate)
      },
      {
        path: 'coachpfe', //自介編輯
        loadComponent: () => import('./experience/components/coach-pfedit/coach-pfedit').then(m => m.CoachPFEdit)
      },
      {
        path: 'coachprofile', //檢視自介
        loadComponent: () => import('./experience/components/coach-profile/coach-profile').then(m => m.CoachProfile)
      },
      //===課程相關===//
      {
        path: 'coursetemp', //模板
        loadComponent: () => import('./experience/components/coach-course-temp/coach-course-temp').then(m => m.CoachCourseTemp)
      },
      {
        path: 'course', //上架中
        loadComponent: () => import('./experience/components/coach-course/coach-course').then(m => m.CoachCourse)
      },
      {
        path: 'coachcoursemore', //課程月曆
        loadComponent: () => import('./experience/components/coach-more-course-calendar/coach-more-course-calendar').then(m => m.CoachMoreCourseCalendar)
      },
      //===============//
      //===使用者定位===//
      {
        path: 'coachintro', //看指定教練介紹
        loadComponent: () => import('./experience/components/coach-intro/coach-intro').then(m => m.Coachintro)
      },
      {
        path: 'myattend', //報名過的課
        loadComponent: () => import('./experience/components/mem-attend/mem-attend').then(m => m.MemAttend)
      },
      {
        path: 'myfav', //收藏
        loadComponent: () => import('./experience/components/mem-favorite/mem-favorite').then(m => m.CoachFavorite)
      },
      {
        path: 'myreview', //新增評論
        loadComponent: () => import('./experience/myComponents/backdrop/reviewcreate/reviewcreate').then(m => m.Reviewcreate)
      },
    ]
  },
  {
    path: 'transaction',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [
      {
        path: 'buy',
        loadComponent: () => import('./experience/components/mem-buycourse/mem-buycourse').then(m => m.CoachBuycourse),
      },
      {
        path: 'finish',
        loadComponent: () => import('./shared/Transac/paylist/paylist').then(m => m.Paylist)
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
            path: 'detail/:id',
            children: [
              // {
              //   path: '',
              //   loadComponent: () => import('./trip/components/detail/detail').then(m => m.Detail), //行程詳情
              // },
              {
                path: 'location',
                loadComponent: () => import('./trip/components/location/location').then(m => m.Location), //地點頁面
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
  //會員中心路由
  {
    path: 'memberCenter',
    loadComponent: () => import('./shared/layouts/member-center-layout/member-center-layout').then(m => m.MemberCenterLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./forum/components/index/index').then(m => m.Index),
        children: [
          {
            path: 'member',
            loadComponent: () => import('./user/components/user-profile/user-profile').then(m => m.UserProfile),

          }
        ]
      }
    ]
  }
  ,
  {
    path: 'searchHouse',
    loadComponent: () => import('./shared/layouts/with-navbar/with-navbar').then(m => m.WithNavbar),
    children: [{
      path: '',
      loadComponent: () => import('./house/components/search-houses/search-houses').then(m => m.SearchHouses)
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
