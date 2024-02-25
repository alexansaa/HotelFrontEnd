import { Component } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { ReservationStatusComponent } from '../reservation-status/reservation-status.component';
import { ReservationUpdateComponent } from '../reservation-update/reservation-update.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgSwitch,
    CommonModule,
    ReservationStatusComponent,
    ReservationUpdateComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  showDisplay: string = 'reservation';

  changeDisplay(value: string) {
    this.showDisplay = value;
  }
}
