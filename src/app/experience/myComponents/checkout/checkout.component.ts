import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../Service/transaction.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [CommonModule, DecimalPipe],
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  isLoading = false;
  errorMsg = '';

  // 這些資料你可以從 route.state / service / @Input 傳進來
  transactionId = 0;
  itemName = '';
  amount = 0;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    // 範例：從 navigation state 取得資料
    const nav = history.state;
    console.log('history.state =', nav);
    this.transactionId = nav.transactionId ?? 0;
    this.itemName = nav.itemName ?? '';
    this.amount = nav.amount ?? 0;
  }

  checkout(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.errorMsg = '';

    const dto = {
      transactionId: this.transactionId,
      itemName: this.itemName
    };

    this.transactionService.getOrderForm(dto).subscribe({
      next: (html: string) => {
        // 把後端回傳的 form HTML 插入 DOM，再呼叫 submit()
        // 絕對不能用 innerHTML + inline <script>，必須手動 submit
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);

        const form = div.querySelector('#ecpay-form') as HTMLFormElement;
        if (form) {
          form.submit(); // 在我們自己的 domain 執行，不受綠界 CSP 限制
        } else {
          this.errorMsg = '無法取得付款表單，請稍後再試';
          this.isLoading = false;
          document.body.removeChild(div);
        }
      },
      error: (err) => {
        console.error('getOrderForm error', err);
        this.errorMsg = '結帳失敗，請稍後再試';
        this.isLoading = false;
      }
    });
  }
}
