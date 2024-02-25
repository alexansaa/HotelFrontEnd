import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Room } from '../models/MyData';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../rooms_services/api.service';

@Component({
  selector: 'app-reservation-status',
  standalone: true,
  imports: [NgFor],
  templateUrl: './reservation-status.component.html',
  styleUrl: './reservation-status.component.css'
})
export class ReservationStatusComponent implements OnInit{
  rooms: Room[] = [];
  minDate = new Date().toISOString().slice(0, 10);

  constructor(
    private apiService: ApiService
  ) {}
  
  ngOnInit(): void {
      this.getAllRooms();
  }

  getAllRooms() {
    this.apiService.allRooms().subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        console.log('Received rooms from backend: ', rooms);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    });
  }
}
