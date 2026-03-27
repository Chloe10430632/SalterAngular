import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-little-island',
  imports: [RouterLink],
  templateUrl: './little-island.html',
  styleUrl: './little-island.css',
})
export class LittleIsland {
  private router = inject(Router);

  island() {
    this.router.navigate(['experience/coachisland'])
  }
  favorite() {
    this.router.navigate(['experience/myfav'])
  }
  attend() {
    this.router.navigate(['experience/myattend'])
  }

}
