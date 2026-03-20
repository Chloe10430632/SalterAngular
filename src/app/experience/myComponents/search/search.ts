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
    console.log('子元件：準備丟出球，內容是：', this.inputString); // 加這行測試
    this.searchEvent.emit(this.inputString)
  }

}
