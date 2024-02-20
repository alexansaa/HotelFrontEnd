import { Component, OnInit } from '@angular/core';
import { ApiService } from '../rooms_services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Reservation } from '../models/MyData';
import { NgFor, NgIf } from '@angular/common';
import { RoomsComponent } from '../rooms/rooms.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopUpUpdateReservationComponent } from '../pop-up-update-reservation/pop-up-update-reservation.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RoomsComponent,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(
    private apiService: ApiService,
    private updateReservatinoPopUp: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllBookings();
  }

  openPopUp(reservation: Reservation): void {
    console.log(reservation);
    const dialogRef = this.updateReservatinoPopUp.open(PopUpUpdateReservationComponent,{
      data: reservation
    });
  }

  onSubmit(): void {
    console.log('clicked');
    
  }

  getAllBookings() {
    this.apiService.allBookings().subscribe({
      next: (reservations: Reservation[]) => {
        this.reservations = reservations;
        console.log('Received rooms from backend: ', reservations);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    });
  }

  // deleteRoom(id: string): void {
  //   this.apiService.deleteRoom(id).subscribe({
  //     next: () => {
  //       console.log('Room deleted! succesfully');
  //       this.rooms = this.rooms.filter((room) => room._id !== id);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Error deleting room: ', error);
  //     }
  //   })
  // }

  // updateRoom(room: Room): void {
  //   this.apiService.updateRoom(room).subscribe({
  //     next: (updateRoom: Room) => {
  //       console.log('Room updated succesfully');
  //       this.rooms = this.rooms.map((r) => r._id === updateRoom._id ? updateRoom : r);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Error updating room: ', error);
  //     }
  //   });
  // }

  // buscarHabitaciones() {
  //   const datosBusqueda = {
  //     num_people: this.numeroPersonas,
  //     start_date: this.startDate,
  //     end_date: this.endDate,
  //     num_rooms: this.numeroHabitaciones
  //   };

  //   console.log(datosBusqueda);

  //   this.apiService.sendData(datosBusqueda).subscribe({
  //     next: (response: SendData[]) => {
  //       // Handle successful response here
  //       console.log('Received data from backend:', response);
  //       this.response = response;
  //       // Access and process the response data (e.g., display in the UI)

  //     },
  //     error: (error: HttpErrorResponse) => {
  //       // Handle errors gracefully
  //       console.error('Error fetching data:', error);
  //       // Display an error message to the user
  //     }
  //   });
  // }
}
