import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
})
export class DragScroll {
  private isDown = false;
  private startX: number = 0;
  private scrollLeft: number = 0;
  private mouseMoved = false; //紀錄是否有移動

  constructor(private el: ElementRef) {
    // 設定滑鼠樣式
    this.el.nativeElement.style.cursor = 'grab';
    this.el.nativeElement.style.userSelect = 'none';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.mouseMoved = false; // 重置移動狀態
    this.el.nativeElement.style.cursor = 'grabbing';// 計算初始點擊位置
    this.startX = e.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;

    const x = e.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;

    if (Math.abs(x - this.startX) > 5) {
      this.mouseMoved = true;
      // 不要改 container 自己，改裡面的「子元素」
      // 這樣 container 還是能接收 mousemove 事件，但裡面的連結點不到
      this.el.nativeElement.querySelectorAll('*').forEach((child: HTMLElement) => {
        child.style.pointerEvents = 'none';
      });
    }

    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.isDown = false;
    this.el.nativeElement.style.cursor = 'grab';

    // 恢復子元素的點擊功能
    this.el.nativeElement.querySelectorAll('*').forEach((child: HTMLElement) => {
      child.style.pointerEvents = '';
    });
  }

  // 攔截點擊事件
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    if (this.mouseMoved) {
      e.preventDefault();    // 阻止預設跳轉
      e.stopPropagation();   // 阻止事件向上傳遞
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDown = false;
    this.el.nativeElement.style.cursor = 'grab';
  }




}
