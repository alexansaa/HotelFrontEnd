import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../rooms_services/api.service';
import { Reservation } from '../models/MyData';
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
export class ConsultComponent{
  reservation: Reservation = {
    checkin_date : new Date(),
    checkout_date: new Date(),
    qty_guests: 0,
    rooms: [],
    total_price: 0,
    user_id: '0',
    _id: '0'
  };
error: any;

  constructor(
    private apiService: ApiService,
  ) { }

  search() {
    this.apiService.reservationSearch(this.reservation).subscribe({
      next: (response: Reservation) => {
        // Handle successful response here
        console.log('Received data from backend:', response);
        this.reservation = response;
        // Access and process the response data (e.g., display in the UI)

      },
      error: (error: HttpErrorResponse) => {
        // Handle errors gracefully
        console.error('Error fetching data:', error);
        // Display an error message to the user
      }
    });
  }
}
