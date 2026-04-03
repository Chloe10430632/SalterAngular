import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {

  transform(avatar: string | null | undefined): string {

    const baseUrl = environment.domain;
    // 1. 處理空值
    if (!avatar) {
      return `${baseUrl}/admin/imgs/default-avatar.png`;
    }

    // 2. 處理已經是完整 URL 的情況
    if (avatar.startsWith('http')) {
      return avatar;
    }

    // 3. 處理路徑拼接

    const path = avatar.startsWith('/') ? avatar : `/${avatar}`;

    return `${baseUrl}${path}`;
  }

}
