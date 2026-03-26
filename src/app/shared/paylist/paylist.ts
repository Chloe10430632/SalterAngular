import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { Router } from '@angular/router';

@Component({
  selector: 'app-paylist',
  imports: [CommonModule, Footer, Header],
  templateUrl: './paylist.html',
  styleUrl: './paylist.css',
})
export class Paylist {
  // 模擬數據綁定
  transactionAmount: number = 2480;
  orderId: string = 'DAISY-2026-X99';

  constructor(private router: Router) { }
  goToDashboard() {
    console.log('回討論版...');
    this.router.navigate(['']);
  }

  printReceipt() {
    window.print();
  }
}
