import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation, Room } from '../models/MyData';
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
  maxCapacity: number = 0;
  minCapacity: number = 0;
  minDate = new Date().toISOString().slice(0, 10);

  constructor(
    public dialogRef: MatDialogRef<PopUpUpdateReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public reservationData: Reservation,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
      this.reservation = this.reservationData;
      this.getCapacity();
  }

  closePopUp() {
    this.dialogRef.close();
  }

  getCapacity() {
    this.reservation.rooms.forEach((roomNumber: number) => {
      this.minCapacity += 1;
      
      this.apiService.selectRoom(roomNumber.toString()).subscribe({
        next: (response: Room) => {
          console.log("get capacity: " + response.people_capacity);
          
          this.maxCapacity += response.people_capacity;
        }
      });
    });
  }

  onAdminUpdate() {
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

  onUserUpdate() {
    
  }

  onUserDelete() {
    this.apiService.reservationDelete(this.reservation).subscribe({
      next: () => {
        console.log('Reservation deleted!');
        this.closePopUp();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    })
  }

  guestQtyChange(event: any) {
    console.log(event.target.value);
    console.log("max capacity: " + this.maxCapacity);
    console.log("min capacity: " + this.minCapacity);
    
    
    if(event.target.value > this.maxCapacity) {
      event.target.value = this.maxCapacity;
    }
    if(event.target.value < this.minCapacity) {
      event.target.value = this.minCapacity;
    }
  }

  dateCheckInChange(event: any) {
    console.log(event.target.value);
  }

  dateCheckOutChange(event: any) {
    console.log(event.target.value);
  }
}
