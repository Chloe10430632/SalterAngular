import { TransactionServiceS } from './../../../experience/Service/transaction.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from "../../footer/footer";
import { Header } from "../../header/header";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paylist',
  imports: [CommonModule, Footer, Header],
  templateUrl: './paylist.html',
  styleUrl: './paylist.css',
})
export class Paylist implements OnInit {
  transactionAmount: number = 0;
  orderId: string = '';
  //------------------------------//
  constructor(private transS: TransactionServiceS,
    private router: Router,
    public route: ActivatedRoute
  ) { }
  //------------------------------//

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParams['orderId'] || '無編號';
    this.transactionAmount = Number(this.route.snapshot.queryParams['amount']) || 0;
  }



  goToDashboard() {
    const source = this.route.snapshot.queryParams['from'];
    if (source === 3)
      this.router.navigate(['/experienxe/myattend']);
    else
      this.router.navigate(['/'])
  }


}
