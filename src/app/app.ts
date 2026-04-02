import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Main } from './shared/main/main';
import { CommonModule, NgClass } from '@angular/common';
import { NotificationService } from './shared/notifyService/notification-service';
import { ChatStateService } from './user/Services/chat-state-service';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Main, NgClass, CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Salter');

  constructor(public router: Router, public notify: NotificationService, public chatState: ChatStateService) { }

  //聊天機器人
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // 發送訊息並處理捲動
  onSend(input: HTMLInputElement) {
    const msg = input.value;
    if (!msg.trim()) return;

    this.chatState.send(msg, () => this.scrollToBottom());
    input.value = ''; // 清空輸入框
  }

  private scrollToBottom(): void {
    try {
      const element = this.chatContainer.nativeElement;
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    } catch (err) { }
  }
  //聊天機器人結束


}
