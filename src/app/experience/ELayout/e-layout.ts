import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiS } from '../Service/UiS';


@Component({
  selector: 'app-e-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './e-layout.html',
})
export class ExperienceLayout {
  ui = inject(UiS); // 注入你寫好的 UI Service
}
