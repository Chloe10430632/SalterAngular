import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {

  confirm(title: string, text: string = '') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fab005',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      reverseButtons: true
    });
  }

  // 2. 成功提示
  success(title: string, text: string = '') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#fab005'
    });
  }

  // 3. 錯誤提示
  error(title: string, text: string = '') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonColor: '#fab005'
    });
  }

}
