import { Component } from '@angular/core';
import { RoomsComponent } from '../rooms/rooms.component';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../rooms_services/api.service';
import { Room, RoomCombination, SearchRoomData } from '../models/MyData';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    RoomsComponent,
    NgFor,
    NgIf,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  private startDate: Date = new Date();
  private endDate: Date = new Date();
  response: RoomCombination[] = []; // Initialize rooms as empty array
  // rooms: Room[] = [];
  totalCost: number = 0; // Store the calculated cost
  minDate = new Date().toISOString().slice(0, 10); // Today's date in "YYYY-MM-DD"

  constructor(
    private apiService: ApiService
  ) { }

  CheckIn(event: any) {
    this.startDate = event.target.value;
  }

  CheckOut(event: any) {
    this.endDate = event.target.value;
  }

  path: string = "../assets/images/selva.jpg";
  alttext: string = "selva image";

  numeroPersonas: number = 1;
  numeroHabitaciones: number = 1;

  incrementarP() {
    if (this.numeroPersonas < 20) {
      this.numeroPersonas++;
    }
  }

  decrementarP() {
    if (this.numeroPersonas > 1) {
      this.numeroPersonas--;
    }
  }

  incrementarH() {
    if (this.numeroHabitaciones < this.numeroPersonas) {
      this.numeroHabitaciones++;
    }
  }

  decrementarH() {
    if (this.numeroHabitaciones > 1) {
      this.numeroHabitaciones--;
    }
  }


  buscarHabitaciones() {
    const datosBusqueda = {
      num_people: this.numeroPersonas,
      start_date: this.startDate,
      end_date: this.endDate,
      num_rooms: this.numeroHabitaciones
    };

    console.log(datosBusqueda);

    this.apiService.searchRoomsCombinations(datosBusqueda).subscribe({
      next: (response: RoomCombination[]) => {
        // Handle successful response here
        console.log('Received data from backend:', response);
        this.response = response;
        // Access and process the response data (e.g., display in the UI)

      },
      error: (error: HttpErrorResponse) => {
        // Handle errors gracefully
        console.error('Error fetching data:', error);
        // Display an error message to the user
      }
    });
  }
  costoCombinacion(roomsCombination: RoomCombination): number {
    const roomsprice = roomsCombination.rooms.map(room => room.price); // Efficient price extraction
    var roomspriceFinal = roomsprice.reduce((total, price) => total + price, 0); // Calculate total cost
    return roomspriceFinal;
  }


  selectRoom(roomsCombination: RoomCombination, Costo: any): void {
    console.log("Enviando datos de habitacion seleccionada", roomsCombination);

    let roomsIds = [];
    for (let i = 0; i < roomsCombination.rooms.length; i++) {
      roomsIds.push(roomsCombination.rooms[i]._id);
    }
    var romspriceFinal = Costo
    const costoString = JSON.stringify(romspriceFinal);
    localStorage.setItem('costoCombinacion', costoString);

    console.log(roomsIds);
    console.log(costoString);
  }
}
