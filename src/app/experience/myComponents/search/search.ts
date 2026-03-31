import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { SearchS } from '../../Service/search';

//===============!!子 component!!===================//

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  searchTerm: string = '';
  Result: CoachAllInfoI[] = [];

  //--------------------------------------------------//
  constructor(private searchS: SearchS) { }
  @Output() searchComplete = new EventEmitter<CoachAllInfoI[]>;
  //--------------------------------------------------//
  search(): void {
    if (!this.searchTerm) return;

    this.searchS.multiSearch(this.searchTerm).subscribe({
      next: (res) => {
        this.searchComplete.emit(res);
        console.log('搜尋完成！', this.Result);
      },
      error: () => { }
    })

  }

}
