import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { AdminComponent } from './admin/admin.component';
import { RoomsComponent } from './rooms/rooms.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgIf } from '@angular/common';
import { ConocenosComponent } from './conocenos/conocenos.component';
import { PagoComponent } from './pago/pago.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConsultComponent } from './consult/consult.component';
import { PrepagoComponent } from './prepago/prepago.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet
    HomeComponent,
    LoginComponent,
    RouterModule,
    SearchComponent,
    RouterModule,
    AdminComponent,
    RoomsComponent,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
    ConocenosComponent,
    NgIf,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ConsultComponent,
    PrepagoComponent
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  customContent?: { title: string, description: string };
  dynamicHeaderData?: string;
}
