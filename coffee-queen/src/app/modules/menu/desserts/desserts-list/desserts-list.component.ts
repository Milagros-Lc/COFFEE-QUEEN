import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../data/services/api/product.service';
import { Product } from '../../../../shared/components/card/card-product/card-product.metadata';

@Component({
  selector: 'app-desserts-list',
  templateUrl: './desserts-list.component.html',
  styleUrls: ['./desserts-list.component.scss']
})
export class DessertsListComponent implements OnInit {

  public products!: Product[];
  public orderDesserts!: Product[];

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.getDessertsProducts();
  }

  getDessertsProducts(){
    this.productService.getAllProducts().subscribe(data => {
      const desserts = data.filter((item: any) => {
        if (item.type === "desserts") {
          return item;
        }
      })
      this.products = desserts;
      this.orderDesserts = this.productService.arrayProducts;
      this.keepQuantityUpdate(this.products, this.orderDesserts)
    });
  }

  keepQuantityUpdate(products: any, orderProduct: any){
    products.forEach((product: any) => {
      orderProduct.forEach((order: Product) => {
        if (order.name == product.name) {
          product.qty = order.qty;
        }
      });
    });
  }

}
