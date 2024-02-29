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
      this.myStartDate = new Date(this.reservation.checkin_date).toISOString().slice(0, 10);
      this.myEndDate = new Date(this.reservation.checkout_date).toISOString().slice(0,10);

      console.log("myStartDate: " + this.myStartDate);
      console.log("myEndDate: " + this.myEndDate);
      

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

  async onUserUpdate() {
    let start_Date = Date.parse(this.userStartDate);
    let end_Date = Date.parse(this.userEndDate);

    var myRooms: Room[] = [];

    try {
      let roomNumber: number = 0;
      for (roomNumber of this.reservation.rooms) {
        const response:any = await this.apiService.infoRoom(roomNumber.toString()).toPromise();
        myRooms.push(response);
      }
    } catch (error) {
      console.error('Error fetching room date: ', error);
    }
    
    if(await myRooms.length === 0) {
      console.log("rooms arreglo vacio");
      return;
    } else {
      console.log("myRooms: " + myRooms);
    }

    myRooms.forEach(async(room: Room) => {
      room.free = true;
      for (const ocupDate of room.occupancy) {
        const compare_start_date = Date.parse(ocupDate[0]);
        const compare_end_date = Date.parse(ocupDate[1]);

        console.log("Room: " + room._id);
        console.log("Compare start date: " + ocupDate[0]);
        console.log("Compare end date: " + ocupDate[1]);
        console.log("my start date: " + this.myStartDate);
        console.log("my end date: " + this.myEndDate);
        console.log("User start date: " + this.userStartDate);
        console.log("User end date: " + this.userEndDate);
        console.log("---------\n\n");
        
        

        if (compare_start_date === Date.parse(this.myStartDate) && compare_end_date === Date.parse(this.myEndDate)) {
          console.log("returning for just already user taken date");

          return;
        }

        if (start_Date < compare_start_date && end_Date < compare_start_date) {
          room.free = true;
        } else if (start_Date > compare_end_date && end_Date > compare_end_date) {
          room.free = true;
        } else {
          room.free = false;
          return;
        }
      }
    });

    myRooms.forEach((room: Room) => {
      if (room.free === false) {
        alert("Habitaciones no disponibles para la fechas indicadas!");
        return;
      }
    })
    
    this.reservation.total_price = this.costCalculation(myRooms);

    console.log(this.reservation);
    

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

  costCalculation (rooms: Room[]) {
    rooms.forEach((room: Room) => {
      console.log(room);
    })
    const roomsprice = rooms.map(room => room.price); // Obtener precios de las habitaciones
    const checkinDate = new Date(this.userStartDate); // Fecha de check-in
    const checkoutDate = new Date(this.userEndDate); // Fecha de check-out
    const numberOfDays = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24); // Número de días de estadía
    const roomspriceFinal = roomsprice.reduce((total, price) => total + price * numberOfDays, 0); // Calcular el costo total multiplicando por el número de días
    const totalValue = parseFloat(roomspriceFinal.toFixed(2));
    console.log("total value: " + totalValue);
    
    return totalValue
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
    // console.log(event.target.value);
    // console.log("max capacity: " + this.maxCapacity);
    // console.log("min capacity: " + this.minCapacity);
    
    if(event.target.value > this.maxCapacity) {
      event.target.value = this.maxCapacity;
    }
    if(event.target.value < this.minCapacity) {
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
