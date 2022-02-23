import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/data/services/api/product.service';
import { LoginService } from 'src/app/data/services/api/login.service';
import { Product } from 'src/app/shared/components/card/card-product/card-product.metadata';
import { Order } from './order-list.metadata';
import { Router } from '@angular/router';
import { OrdersService } from '../../../data/services/api/orders.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert, NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {

  public products!: Product[];
  public order: Order = {
    id: 0,
    userName: '',
    client: '',
    products: [
      {
        id: 0,
        name: '',
        price: 0,
        image: '',
        type: '',
        qty: 0,
        subTotal: 0,
        dateEntry: '',
      },
    ],
    total: 0,
    totalQty: 0,
    numberTable:'',
    status: '',
    dateEntry: Date,
    dateDelivering: '',
    dateDone: '',
    timeResult: '',
    dateProcessed: '',
    dateCanceled: '',
    additional:'' ,
  };
  public deleteSubtotal: number = 0;
  public quantity: number = 0;
  public arrayNumberTable: number[] = [];
  public optionSelected: string = '0';
  private _success = new Subject<string>();
  successMessage = '';
  constructor(public productService: ProductService,public loginService: LoginService,
    private router: Router,
    public ordersService: OrdersService,
    alertConfig: NgbAlertConfig) {
    this.arrayNumberTable=[1,2,3,4,5];
    alertConfig.dismissible = false;
  }

  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert!: NgbAlert;

  ngOnInit(): void {
    this.order.userName=this.loginService.disparador.getValue().name;
    this.products = this.productService.arrayProducts;
    this.products.map((ele: any) => {
      this.order.total += ele.subTotal;
      this.order.totalQty += ele.qty;
    });
    this.order.products= this.products;

    //successful modal setup
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  captureNumberTable(){
    this.order.numberTable=this.optionSelected;
  }

  sendOrder(){
    this.order.products = this.productService.arrayProducts;
    this.order.status = 'pending'
    this.order.dateEntry = new Date().toString();
    if(this.order.client == '' || this.order.numberTable == '' || this.order.total == 0){
      this._success.next(`Hay campos vacíos. Verifique antes de enviar por favor.`);
    }
    else{
      this.ordersService.postOrder(this.order);
      this.order.products.forEach(product => {
      this.productService.setProducts(product, 'delete');
      })
      this.router.navigate(['product']);
    }

  }

  increaseQuantity(product: any) {
    this.quantity = product.qty += 1;
    product.subTotal = this.quantity * product.price;
    this.order.total += product.subTotal;
    this.order.total -= product.price * (this.quantity - 1);
    this.order.totalQty += 1
  }

  decreaseQuantity(product: any) {
    if (product.qty < 2) {
      product.qty = 1;
      product.subTotal = product.price;
    } else {
      this.quantity = product.qty -= 1;
      product.subTotal = this.quantity * product.price;
      this.order.total -= product.subTotal;
      this.order.total += product.price * (this.quantity - 1);
      this.order.totalQty -= 1
    }
    return this.order.total;
  }

  deleteProduct(product: any) {
    this.products.filter((item: any) => {
      if (item.name == product.name) {
        const newLocal = 'delete';
        this.productService.setProducts(item, newLocal);
      } else {
        this.deleteSubtotal = product.subTotal - product.price;
      }
    });
    this.products = this.productService.arrayProducts;
    if (product.qty > 1) {
      this.order.total = this.decreaseQuantity(product) - product.subTotal;
    } else {
      this.order.total = this.decreaseQuantity(product) - product.price;
    }
    this.order.totalQty -= product.qty;
  }
}
