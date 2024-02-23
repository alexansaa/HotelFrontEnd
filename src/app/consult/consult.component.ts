import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../rooms_services/api.service';
import { Reservation } from '../models/MyData';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUpdateReservationComponent } from '../pop-up-update-reservation/pop-up-update-reservation.component';

@Component({
  selector: 'app-consult',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.css'
})
export class ConsultComponent {
  reservationId: string = ""; // Add the reservationId variable with initial value
  reservation!: Reservation;

  error: any;

  constructor(
    private apiService: ApiService,
    private updateReservatinoPopUp: MatDialog
  ) { }

  search() {
    console.log(this.reservationId);
    if (this.reservationId) { // Check if reservationId has a value
      this.apiService.reservationSearch(this.reservationId).subscribe({
        next: (response: Reservation) => {
          console.log('Received data from backend:', response);
          this.reservation = response
          this.reservation.admin = false
          this.openPopUp(this.reservation)


        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
        }
      });
    } else {
      console.error('Please enter a reservation ID');
    }
  }

  openPopUp(reservation: Reservation): void {
    console.log(reservation);
    const dialogRef = this.updateReservatinoPopUp.open(PopUpUpdateReservationComponent,{
      data: reservation
    });
  }

}
