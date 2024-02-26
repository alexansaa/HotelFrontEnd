import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Room } from '../models/MyData';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../rooms_services/api.service';

@Component({
  selector: 'app-reservation-status',
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ],
  templateUrl: './reservation-status.component.html',
  styleUrl: './reservation-status.component.css'
})
export class ReservationStatusComponent implements OnInit {
  private startDate: string = '';
  private endDate: string = '';
  rooms: Room[] = [];
  minDate = new Date().toISOString().slice(0, 10);

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // this.getAllRooms();
  }

  CheckIn(event: any) {    
    this.startDate = event.target.value;
  }

  CheckOut(event: any) {
    this.endDate = event.target.value;
  }

  getAllRooms() {
    this.apiService.allRooms().subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        console.log('Received rooms from backend: ', rooms);
        this.checkDisponibility();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    });
  }

  checkDisponibility() {
    let start_Date = Date.parse(this.startDate);
    let end_Date = Date.parse(this.endDate);

    this.rooms.forEach((room) => {
      room.free = true;
      room.occupancy.forEach((ocupDate) => {
        const compare_start_date = Date.parse(ocupDate[0]);
        const compare_end_date = Date.parse(ocupDate[1]);

        if (compare_start_date < start_Date && compare_end_date < start_Date) {
          room.free = true;
        } else if (compare_start_date > end_Date && compare_end_date > end_Date) {
          room.free = true;
        } else {
          room.free = false;
          return;
        }
      })
    });
  }

  filterUpdate() {
    console.log(this.startDate);
    console.log(this.endDate);
    
    
    this.getAllRooms();
    console.log('filter clicked');
    
  }
}
