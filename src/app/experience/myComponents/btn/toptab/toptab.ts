import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toptab',
  imports: [],
  templateUrl: './toptab.html',
  styleUrl: './toptab.css',
})
export class Toptab {
  private router = inject(Router)


  template() {
    this.router.navigate(['/experience/coursetemp']);
  }
  onshelf() {
    this.router.navigate(['/experience/course']);
  }
  profile() {
    this.router.navigate(['/experience/coachprofile']);
  }
  profiledit() {
    this.router.navigate(['/experience/coachpfe']);
  }
}
