import { Routes } from "@angular/router";
import { CourseforCoachProfile } from "../myComponents/card/coursefor-coach-profile/coursefor-coach-profile";
import { ExperienceLayout } from "../ELayout/e-layout";
import { Index } from "../components/coach-index";
import { MemFavorite } from "../components/mem-favorite/mem-favorite";


export const EXPERIENCE_EROUTES: Routes = [
  {
    path: '',
    component: ExperienceLayout,// 大包廂
    children: [
      { path: 'coach-profile/:id', component: CourseforCoachProfile }, // 教練頁
      { path: 'index', component: Index  }, // 入口頁
      { path: 'fav-:id', component: MemFavorite }//收藏頁
    ]
  }
];
