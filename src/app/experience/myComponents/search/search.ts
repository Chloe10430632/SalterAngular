import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  inputString = "";
  @Output() searchEvent = new EventEmitter<string>();

  search(): void {
    this.searchEvent.emit(this.inputString)
  }

}
