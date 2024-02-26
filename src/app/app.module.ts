import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPayPalModule } from 'ngx-paypal';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NgxPayPalModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
