import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from '../models/MyData';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../rooms_services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pop-up-update-reservation',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './pop-up-update-reservation.component.html',
  styleUrl: './pop-up-update-reservation.component.css'
})
export class PopUpUpdateReservationComponent implements OnInit{
  reservation!: Reservation;

  constructor(
    public dialogRef: MatDialogRef<PopUpUpdateReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public reservationData: Reservation,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
      this.reservation = this.reservationData;
  }

  closePopUp() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.reservation._id);
    this.apiService.reservationUpdate(this.reservation).subscribe({
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
