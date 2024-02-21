import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../rooms_services/api.service';
import { Reservation, SearchReservation } from '../models/MyData';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

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
  ) { }

  search() {
    console.log(this.reservationId);
    if (this.reservationId) { // Check if reservationId has a value
      this.apiService.reservationSearch(this.reservationId).subscribe({
        next: (response: SearchReservation) => {
          // Handle successful response here
          console.log('Received data from backend:', response);
          //this.reservation = response;
          // ...
        },
        error: (error: HttpErrorResponse) => {
          // Handle errors gracefully
          console.error('Error fetching data:', error);
          // ...
        }
      });
    } else {
      // Display an error message if reservationId is empty
      console.error('Please enter a reservation ID');
    }
  }

}
