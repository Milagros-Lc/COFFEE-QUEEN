import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { TitleH1Component } from '../../shared/components/title-h1/title-h1.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductDetailComponent,
    //TitleH1Component
  ],
  imports: [
  CommonModule, 
    SharedModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
