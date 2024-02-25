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

  isButtonDisabled = false; // Flag to control button state
  fechas: any;

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

    if (this.startDate === null || this.endDate === null || this.endDate <= this.startDate) {
      // Handle invalid date selection gracefully (e.g., display error message)
      console.log('Fecha vacia o invalida');
      alert('Fecha vacia o invalida');
      return;
    }

    const datosBusqueda = {
      num_people: this.numeroPersonas,
      start_date: this.startDate,
      end_date: this.endDate,
      num_rooms: this.numeroHabitaciones
    };

    console.log(datosBusqueda);

    var fechas = datosBusqueda
    const fechasF = JSON.stringify(fechas);
    localStorage.setItem('costoCombinacion', fechasF);

    console.log(fechasF)

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
    const roomsprice = roomsCombination.rooms.map(room => room.price); // Obtener precios de las habitaciones
    const checkinDate = new Date(this.startDate); // Fecha de check-in
    const checkoutDate = new Date(this.endDate); // Fecha de check-out
    const numberOfDays = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24); // Número de días de estadía
    const roomspriceFinal = roomsprice.reduce((total, price) => total + price * numberOfDays, 0); // Calcular el costo total multiplicando por el número de días
    return parseFloat(roomspriceFinal.toFixed(2));
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

    var combinacion = roomsCombination
    const combinacionHabitaciones = JSON.stringify(combinacion);
    localStorage.setItem('costoCombinacion', combinacionHabitaciones);

    console.log(combinacionHabitaciones)

    console.log(roomsIds);
    console.log(costoString);
  }
}
