import { inject, Injectable } from '@angular/core';
import { ChatService } from './chat-service';
import { BehaviorSubject } from 'rxjs';
import { ChatResponse } from '../interfaces/IChatResponse';

export interface Message {
  role: 'user' | 'bot';
  text: string;
  time: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatStateService {
  private chatService = inject(ChatService);

  isOpen = new BehaviorSubject<boolean>(false);
  isLoading = false;
  chatHistory: { role: 'user' | 'bot', content: string }[] = [];

  toggle() { this.isOpen.next(!this.isOpen.value); }

  send(message: string, scrollFn: () => void) {
    if (!message.trim() || this.isLoading) return;

    this.chatHistory.push({ role: 'user', content: message });
    this.isLoading = true;
    setTimeout(() => scrollFn(), 50); // 送出後立刻捲動

    // 加上你原本的提示詞優化
    const promptForApi = `請使用【繁體中文】回答：${message}`;

    this.chatService.sendMessage(promptForApi).subscribe({
      next: (res) => {
        this.chatHistory.push({ role: 'bot', content: res.reply });
        this.isLoading = false;
        setTimeout(() => scrollFn(), 50);
      },
      error: (err) => {
        this.isLoading = false;
        this.chatHistory.push({
          role: 'bot',
          content: '🌊 哎呀！海風太強，小沙不小心被吹走了... 請再試著呼喚我一次！'
        });
        setTimeout(() => scrollFn(), 50);
      }
    });
  }

  resetChat() {
    this.isOpen.next(false); // 關閉視窗
    this.chatHistory = [];   // 清空對話
    this.isLoading = false;  // 停止讀取狀態
  }
}
