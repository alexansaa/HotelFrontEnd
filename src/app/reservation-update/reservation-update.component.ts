import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/MyData';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUpdateReservationComponent } from '../pop-up-update-reservation/pop-up-update-reservation.component';
import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../rooms_services/api.service';

@Component({
  selector: 'app-reservation-update',
  standalone: true,
  imports: [NgFor],
  templateUrl: './reservation-update.component.html',
  styleUrl: './reservation-update.component.css'
})
export class ReservationUpdateComponent implements OnInit{
  reservations: Reservation[] = [];

  ngOnInit(): void {
    this.getAllBookings();
  }

  constructor(
    private updateReservatinoPopUp: MatDialog,
    private apiService: ApiService
  ){}

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

  openPopUp(reservation: Reservation): void {
    console.log(reservation);
    reservation.admin = true;
    const dialogRef = this.updateReservatinoPopUp.open(PopUpUpdateReservationComponent,{
      data: reservation
    });
  }
}
