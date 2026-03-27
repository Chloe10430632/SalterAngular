import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Toptab } from '../../btn/toptab/toptab';

@Component({
  selector: 'app-coachpfedit',
  imports: [Toptab],
  templateUrl: './coachpfedit.html',
  styleUrl: './coachpfedit.css',
})
export class Coachpfedit {
  private router = inject(Router);
  onSave() { }

  island() {
    this.router.navigate(['/experience']);
  };

}
