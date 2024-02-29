import { Component, Inject, OnInit } from '@angular/core';
import { Payload, Reservation, Room, User } from '../models/MyData';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../rooms_services/api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  reservation!: Reservation;
  maxCapacity: number = 0;
  minCapacity: number = 0;
  minDate = new Date().toISOString().slice(0, 10);
  myStartDate = new Date().toISOString().slice(0, 10);
  myEndDate = new Date().toISOString().slice(0, 10);
  userStartDate = new Date().toISOString().slice(0, 10);
  userEndDate = new Date().toISOString().slice(0, 10);
  precio: number = 0;
  paypalId: string = "";

  constructor(
    //public dialogRef: MatDialogRef<PopUpUpdateReservationComponent>,
    //public reservationData: Reservation,
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    //private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    const reservationString = localStorage.getItem('reservationConsult');
    if (reservationString) {
      this.reservation = JSON.parse(reservationString);
    }
    //this.reservation = this.reservation;
    this.myStartDate = new Date(this.reservation.checkin_date).toISOString().slice(0, 10);
    this.myEndDate = new Date(this.reservation.checkout_date).toISOString().slice(0, 10);
    this.userStartDate = new Date(this.reservation.checkin_date).toISOString().slice(0, 10);
    this.userEndDate = new Date(this.reservation.checkout_date).toISOString().slice(0, 10);
    this.precio = this.reservation.total_price;
    this.paypalId = this.reservation.capturedId;

    this.getCapacity();

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

  async onUserUpdate() {
    // let start_Date = Date.parse(this.userStartDate);
    // let end_Date = Date.parse(this.userEndDate);

    var myRooms: Room[] = [];

    try {
      let roomNumber: number = 0;
      for (roomNumber of this.reservation.rooms) {
        const response: any = await this.apiService.infoRoom(roomNumber.toString()).toPromise();
        myRooms.push(response);
      }

      if (this.checkDates(myRooms)) {
        this.reservation.total_price = this.costCalculation(myRooms);
        this.reservation.lastStartDate = new Date(this.myStartDate);
        this.reservation.lastEndDate = new Date(this.myEndDate);
        // modificacion directa a backend sin revisar paypal
        this.apiService.reservationUpdate(this.reservation).subscribe({
          next: (response: Reservation) => {
            console.log("Reservacion actualizada con exito");
            console.log(response);
            const myPayload: Payload = {
              body: 'Tu Reserva en el hotel Copo de Nieve ha sido modificada con exito!.\nLa modificacion de su cuenta sera procesado hasta en un maximo de 3 dias!\nDetalles de su reserva:\nId Reserva: ' + this.reservation._id + "\nFecha de Checkin: " + this.reservation.checkin_date + "\nFecha de Checkout: " + this.reservation.checkout_date + "\nHabitaciones: " + this.reservation.rooms + "\nNúmero de huéspedes: " + this.reservation.qty_guests + "\nPrecio Total: " + this.reservation.total_price,
              subject: 'Confirmación de Modificacion de Reserva Hotel Copo de Nieve'
            }
            this.enviarCorreoCliente(myPayload);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching data:', error);
          }
        });

      } else {
        console.log("No se puede actualizar por las fechas seleccionadas");
        return;
      }

    } catch (error) {
      console.error('Error fetching room date: ', error);
    }

    if (myRooms.length === 0) {
      console.log("rooms arreglo vacio");
      return;
    } else {
      console.log("myRooms: " + myRooms);
    }
  }

  enviarCorreoCliente(payload: Payload) {
    // enviamos correo al cliente
    this.apiService.infoUser(this.reservation.user_id).subscribe({
      next: (response: User) => {
        const emailData = {
          recipient: response.email,
          body: payload.body,
          subject: payload.subject
        };

        this.http.post('https://backend-hr.onrender.com/send_email', emailData).subscribe({
        // this.http.post('http://localhost:5000/send_email', emailData).subscribe({
          next: (response) => {
            console.log('Correo de modificacion enviado', response);
            this.router.navigate(['/confirmacion']);
          },
          error: (error) => {
            console.error('Error al enviar el correo de modificacion', error);
          }
        });
      }
    });
  }

  checkDates(rooms: Room[]): boolean {
    let start_Date = Date.parse(this.userStartDate);
    let end_Date = Date.parse(this.userEndDate);
    let isValid = true; // Variable para verificar si todas las fechas son válidas

    rooms.forEach((room: Room) => {
      room.occupancy.forEach((occupancy) => {
        let roomStart_Date = Date.parse(occupancy[0]);
        let roomEnd_Date = Date.parse(occupancy[1]);

        if (Date.parse(this.myStartDate) == roomStart_Date && Date.parse(this.myEndDate) == roomEnd_Date) {
          console.log("Misma fecha");
        } else if (start_Date >= roomStart_Date && start_Date <= roomEnd_Date) {
          console.log("Fecha de inicio dentro de una reserva");
          isValid = false;
        } else if (end_Date >= roomStart_Date && end_Date <= roomEnd_Date) {
          console.log("Fecha de fin dentro de una reserva");
          isValid = false;
        } else if (start_Date <= roomStart_Date && end_Date >= roomEnd_Date) {
          console.log("Fecha de inicio y fin dentro de una reserva");
          isValid = false;
        }
      });
    });

    return isValid; // Devolver el resultado de la validación
  }


  costCalculation(rooms: Room[]) {
    // rooms.forEach((room: Room) => {
    //   console.log("calculator\n");

    //   console.log(room);
    // })
    const roomsprice = rooms.map(room => room.price); // Obtener precios de las habitaciones
    const checkinDate = new Date(this.userStartDate); // Fecha de check-in
    const checkoutDate = new Date(this.userEndDate); // Fecha de check-out

    const numberOfDays = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24); // Número de días de estadía

    const roomspriceFinal = roomsprice.reduce((total, price) => total + price * numberOfDays, 0); // Calcular el costo total multiplicando por el número de días
    const totalValue = parseFloat(roomspriceFinal.toFixed(2));

    return totalValue
  }

  onUserDelete() {
    this.apiService.reservationDelete(this.reservation).subscribe({
      next: () => {
        console.log('Reservation deleted!');

        const myPayload: Payload = {
          body: 'Tu Reserva en el hotel Copo de Nieve ha sido cancelada!.\nTu reembolso sera procesado hasta en un maximo de 3 dias!\n',
          subject: 'Cancelacion de Reserva Hotel Copo de Nieve'
        };
        this.enviarCorreoCliente(myPayload);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    });
  }

  guestQtyChange(event: any) {
    // console.log(event.target.value);
    // console.log("max capacity: " + this.maxCapacity);
    // console.log("min capacity: " + this.minCapacity);

    if (event.target.value > this.maxCapacity) {
      event.target.value = this.maxCapacity;
    }
    if (event.target.value < this.minCapacity) {
      event.target.value = this.minCapacity;
    }
  }

  dateCheckInChange(event: any) {
    this.userStartDate = event.target.value;
  }

  dateCheckOutChange(event: any) {
    this.userEndDate = event.target.value;
  }

}
