import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../data/services/api/product.service';
import { Product, Products } from '../../../shared/components/card/card-product/card-product.metadata';

//@Pipe({filter:'filter'})

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products?: Product[];
  public todos!: Product[];
  public getProduct: string = '';
  public array: any;

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.cleanSearch();
  }

  searchProduct() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.todos = this.productService.arrayProducts;
      if (this.getProduct === '') {
        this.products = data;
      } else {
        this.products.forEach((producto) => {
          this.todos.forEach((pedido) => {
            if (pedido.name == producto.name) {
              // producto.qty = pedido.qty;
              producto.messageCard = pedido.messageCard;
            }
          });
        });

        this.products = this.products?.filter(
          (elem) => elem.name.toLowerCase().indexOf(this.getProduct) > -1
        );
      }
    });
  }

  cleanSearch() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
     // add qty
      this.products.map((product)=> {
        Object.defineProperty(product, 'qty', {
          value: 0,
          writable: true,
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(product, 'subTotal', {
          value: 0,
          writable: true,
          enumerable: true,
          configurable: true
        });
      })
      console.log('this.products en product list', this.products);
      this.todos = this.productService.arrayProducts;
      this.products.forEach((producto) => {
        this.todos.forEach((pedido) => {
          console.log('producto', producto);
          console.log('pedido', pedido);

          if (pedido.name == producto.name) {
            producto.qty = pedido.qty;
            producto.messageCard = pedido.messageCard;
          }
        });
      });
    });
    this.getProduct = '';
  }
}
