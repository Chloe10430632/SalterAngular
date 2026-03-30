import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toptab',
  imports: [],
  templateUrl: './toptab.html',
  styleUrl: './toptab.css',
})
export class Toptab {
 private router = inject(Router);

private getCoachId(): string {
  const id = localStorage.getItem('coachId');
  console.log('Toptab 嘗試從 Storage 拿 ID，結果是:', id);

  // 如果拿到的 ID 是 '1' 或 null，我們就強制用 1001024
  if (!id || id === '1') {
    console.warn('發現無效 ID，強制修正為 1001024');
    return '1001024';
  }
  return id;
}  template() {
    this.router.navigate(['/experience/coursetemp']);
  }

  onshelf() {
    this.router.navigate(['/experience/course']);
  }

  profile() {
    const id = this.getCoachId();
    // ✅ 正確寫法：陣列的第二個元素就是 :id
    this.router.navigate(['/experience/coachprofile', id]);
  }

  profiledit() {
    const id = this.getCoachId();
    this.router.navigate(['/experience/coachpfe', id]);
  }
}
