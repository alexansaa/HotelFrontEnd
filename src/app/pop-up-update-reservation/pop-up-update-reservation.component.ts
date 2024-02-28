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
  myStartDate = new Date().toISOString().slice(0, 10);
  myEndDate = new Date().toISOString().slice(0, 10);
  userStartDate = new Date().toISOString().slice(0, 10);
  userEndDate = new Date().toISOString().slice(0, 10);

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
      
      this.apiService.infoRoom(roomNumber.toString()).subscribe({
        next: (response: Room) => {
          // console.log("get capacity: " + response.people_capacity);
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
    let start_Date = Date.parse(this.userStartDate);
    let end_Date = Date.parse(this.userEndDate);

    const myRooms: Room[] = [];

    this.reservation.rooms.forEach((roomNumber: number) => {
      this.apiService.infoRoom(roomNumber.toString()).subscribe({
        next: (response: Room) => {
          response.free = true;
          response.occupancy.forEach((ocupDate) => {
            const compare_start_date = Date.parse(ocupDate[0]);
            const compare_end_date = Date.parse(ocupDate[1]);

            if (compare_start_date === Date.parse(this.myStartDate) && compare_end_date === Date.parse(this.myEndDate)) {
              return;
            }

            if (compare_start_date < start_Date && compare_end_date < start_Date) {
              response.free = true;
            } else if (compare_start_date > end_Date && compare_end_date > end_Date) {
              response.free = true;
            } else {
              response.free = false;
              return;
            }
          });
          myRooms.push(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
        }
      })
    });

    myRooms.forEach((room: Room) => {
      if (room.free === false) {
        alert("Habitaciones no disponibles para la fechas indicadas!");
        return;
      }
    })

    this.reservation.checkin_date = new Date(Date.parse(this.userStartDate));
    this.reservation.checkout_date = new Date(Date.parse(this.userEndDate));

    this.apiService.reservationUpdate(this.reservation).subscribe({
      next: (response: Reservation) => {
        console.log("Reservacion actualizada con exito");
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
      }
    })
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
    this.userStartDate   = event.target.value;
  }

  dateCheckOutChange(event: any) {
    this.userEndDate = event.target.value;
  }
}
