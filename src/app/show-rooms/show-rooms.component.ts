import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Room } from '../models/MyData';
import { ApiService } from '../rooms_services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomsComponent } from '../rooms/rooms.component';

@Component({
  selector: 'app-show-rooms',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RoomsComponent
  ],
  templateUrl: './show-rooms.component.html',
  styleUrl: './show-rooms.component.css'
})
export class ShowRoomsComponent implements OnInit{
  rooms: Room[] = [];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getAllrooms();
  }

  getAllrooms() {
    this.apiService.allRooms().subscribe({
      next: (response: Room[]) => {
        console.log('Rooms Data from backend: ' + response);
        this.rooms = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
      }
    });
  }
}
