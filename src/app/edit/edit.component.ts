import { Component, Inject, OnInit } from '@angular/core';
import { Payload, Refund, Reservation, Room, User } from '../models/MyData';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../rooms_services/api.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
// import { environment } from '../../environment';
// import { environment } from '../../environment';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgxPayPalModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  loading: boolean = false;
  reservation!: Reservation;
  refund!: Refund;
  maxCapacity: number = 0;
  minCapacity: number = 0;
  minDate = new Date().toISOString().slice(0, 10);
  myStartDate = new Date().toISOString().slice(0, 10);
  myEndDate = new Date().toISOString().slice(0, 10);
  userStartDate = new Date().toISOString().slice(0, 10);
  userEndDate = new Date().toISOString().slice(0, 10);
  precio: number = 0;
  difference: string = "";
  paypalId: string = "";

  public payPalConfig?: IPayPalConfig;

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

    //Refund data
    this.refund = {
      reason: 'Cancelacion de reserva',
      value: this.reservation.total_price,
      user_id: this.reservation.user_id,
      booking_id: this.reservation._id
    };

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

    var myRooms: Room[] = [];

    try {
      let roomNumber: number = 0;
      for (roomNumber of this.reservation.rooms) {
        const response: any = await this.apiService.infoRoom(roomNumber.toString()).toPromise();
        myRooms.push(response);
      }

      if (this.checkDates(myRooms)) {
        this.reservation.lastStartDate = new Date(this.myStartDate);
        this.reservation.lastEndDate = new Date(this.myEndDate);


        this.reservation.total_price = this.costCalculation(myRooms, this.precio);
        
        // modificacion directa a backend sin revisar paypal

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

        //this.http.post('https://backend-hr.onrender.com/send_email', emailData).subscribe({
        this.http.post('http://localhost:5000/send_email', emailData).subscribe({
          next: (response) => {
            console.log('Correo de modificacion enviado', response);
            //this.router.navigate(['/confirmacion']);
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


  costCalculation(rooms: Room[], price: number) {
    const roomsprice = rooms.map(room => room.price); // Obtener precios de las habitaciones
    const checkinDate = new Date(this.userStartDate); // Fecha de check-in
    const checkoutDate = new Date(this.userEndDate); // Fecha de check-out

    const numberOfDays = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24); // Número de días de estadía

    const roomspriceFinal = roomsprice.reduce((total, price) => total + price * numberOfDays, 0); // Calcular el costo total multiplicando por el número de días
    const totalValue = parseFloat(roomspriceFinal.toFixed(2));

    console.log("Valor antiguo: " + price);
    console.log("Valor nuevo: " + totalValue);
    

    if (totalValue == price) {
      console.log('Mismo precio, no se hace ninguna devolucion o pago adicional');
      alert('Mismo precio, no se hace ninguna devolucion o pago adicional');

      console.log("reservation mod: " + this.reservation);
      
      
      this.apiService.reservationUpdate(this.reservation).subscribe({
        next: (response: Reservation) => {
          console.log("Reservacion actualizada con exito");
          console.log(response);
          const myPayload: Payload = {
            body: "Tu Reserva en el hotel Copo de Nieve ha sido modificada con exito!.\nDetalles de su reserva:\nId Reserva:" + this.reservation._id + "\nFecha de Checkin: " + this.reservation.checkin_date + "\nFecha de Checkout: " + this.reservation.checkout_date + "\nHabitaciones: " + this.reservation.rooms + "\nNúmero de huéspedes: " + this.reservation.qty_guests + "\nPrecio Total: " + this.reservation.total_price+ "\nValor adicional cobrado: " + this.difference + "\n\nMuchas gracias!!!",
            subject: 'Confirmación de Modificacion de Reserva Hotel Copo de Nieve'
          }
          this.enviarCorreoCliente(myPayload);
          this.router.navigate(['/update']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
        }
      });


    } else if (totalValue > price) {
      this.difference = (totalValue - price).toFixed(2);
      console.log('Se va a realizar un recargo adicinal de: ' + this.difference + '\n\nMuchas gracias');
      alert('Se va a realizar un recargo adicinal de: ' + this.difference + '\n\nMuchas gracias');
      this.payment();

    } else if (totalValue < price) {
      this.difference = (price - totalValue).toFixed(2);

      //Datos para el refund
      this.refund.value = parseFloat(this.difference);
      this.refund.reason = 'Modificacion de reserva';

      this.realizarReembolso(this.refund);

      console.log('Se realizara una devolucion de: ' + this.difference + '\n\nMuchas gracias');
      alert('Se realizara una devolucion de: ' + this.difference + '\n\nMuchas gracias');
      const myPayload: Payload = {
        body: "Tu Reserva en el hotel Copo de Nieve ha sido modificada con exito!.\nDetalles de su reserva:\nId Reserva:" + this.reservation._id + "\nFecha de Checkin: " + this.reservation.checkin_date + "\nFecha de Checkout: " + this.reservation.checkout_date + "\nHabitaciones: " + this.reservation.rooms + "\nNúmero de huéspedes: " + this.reservation.qty_guests + "\nPrecio Total: " + this.reservation.total_price+ "\nEn un lapso de máximo 3 días se te hará el reembolso de: " + this.difference + "\n\nMuchas gracias!!!",
        subject: 'Confirmación de Modificacion de Reserva Hotel Copo de Nieve'
      }

      this.apiService.reservationUpdate(this.reservation).subscribe({
        next: (response: Reservation) => {
          console.log("Reservacion actualizada con exito");
          console.log(response);
          this.enviarCorreoCliente(myPayload);
          this.router.navigate(['/update']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
        }
      });
    }
    return totalValue;
  }

  //Metodo para realizar pago del restante con PayPal

  private payment(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'ASDlG6RI5mkZWEgxorLCeLUC0o9mDCX-rT8wWr99HplGw1yHDpEKmavutkGP8cm5c7bODWUbHcB01nDa',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: this.difference,
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value: this.difference
                      }
                  }
              },
              items: [{
                  name: 'Reserva de habitación Copo de Nieve',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'USD',
                      value: this.difference,
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          // Aquí puedes manejar la aprobación antes de la autorización si es necesario
          this.loading = true;

          actions.order.capture().then((details: any) => {
              // Captura exitosa, puedes acceder al ID de la transacción en details.id
              // bookingData.capturedId = details.id;
              // console.log('ID del pago capturado:', bookingData.capturedId);
              // Ahora puedes realizar cualquier operación adicional que necesites con el ID del pago
          });
      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - transacción completada', data);

          this.apiService.reservationUpdate(this.reservation).subscribe({
            next: (response: Reservation) => {
              console.log("Reservacion actualizada con exito");
              console.log(response);
              const myPayload: Payload = {
                body: "Tu Reserva en el hotel Copo de Nieve ha sido modificada con exito!.\nDetalles de su reserva:\nId Reserva:" + this.reservation._id + "\nFecha de Checkin: " + this.reservation.checkin_date + "\nFecha de Checkout: " + this.reservation.checkout_date + "\nHabitaciones: " + this.reservation.rooms + "\nNúmero de huéspedes: " + this.reservation.qty_guests + "\nPrecio Total: " + this.reservation.total_price+ "\nValor adicional cobrado: " + this.difference + "\n\nMuchas gracias!!!",
                subject: 'Confirmación de Modificacion de Reserva Hotel Copo de Nieve'
              }
              this.enviarCorreoCliente(myPayload);
              this.router.navigate(['/update']);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error fetching data:', error);
            }
          });
        

      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
      },
      onError: err => {
          console.log('OnError', err);
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
      }
  };

  } 


  // private realizarDevolucion() {
  //   // Prepara las credenciales de autenticación para la API de PayPal
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', 'Basic ' + btoa(process.env.paypalClientId + ':' + process.env.paypalClientSecret));
  // private realizarDevolucion() {
  //   // Prepara las credenciales de autenticación para la API de PayPal
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', 'Basic ' + btoa(process.env.paypalClientId + ':' + process.env.paypalClientSecret));
  
  //   // Crea el cuerpo de la solicitud de devolución
  //   const data = {
  //     amount: {
  //       total: this.difference,
  //       currency: 'USD'
  //     }
  //   };
  //   // Crea el cuerpo de la solicitud de devolución
  //   const data = {
  //     amount: {
  //       total: this.difference,
  //       currency: 'USD'
  //     }
  //   };
  
  //   // Realiza la solicitud de devolución a la API de PayPal
  //   this.http.post<any>('https://api.sandbox.paypal.com/v1/payments/capture/' + this.paypalId + '/refund', data, { headers })
  //     .subscribe(
  //       (response) => {
  //         // La devolución se realizó con éxito
  //         console.log('Devolución exitosa:', response);
  //         // Puedes notificar al usuario sobre la devolución exitosa aquí, por ejemplo, enviando un correo electrónico
  //         const myPayload: Payload = {
  //           body: 'Tu Reserva en el hotel Copo de Nieve ha sido cancelada!.\nSe ha reembolsado a tu cuenta de paypal la cantidad de: ' + this.difference + '\n\nMuchas gracias!!!',
  //           subject: 'Cancelacion de Reserva Hotel Copo de Nieve'
  //         };
  //         this.enviarCorreoCliente(myPayload);
  //       },
  //       (error) => {
  //         // Se produjo un error al procesar la devolución
  //         console.error('Error al realizar la devolución:', error);
  //         // Puedes notificar al usuario sobre el error aquí, por ejemplo, mostrando un mensaje en la interfaz de usuario
  //         alert('Error al realizar la devolución');
  //       }
  //     );
  // }
  //   // Realiza la solicitud de devolución a la API de PayPal
  //   this.http.post<any>('https://api.sandbox.paypal.com/v1/payments/capture/' + this.paypalId + '/refund', data, { headers })
  //     .subscribe(
  //       (response) => {
  //         // La devolución se realizó con éxito
  //         console.log('Devolución exitosa:', response);
  //         // Puedes notificar al usuario sobre la devolución exitosa aquí, por ejemplo, enviando un correo electrónico
  //         const myPayload: Payload = {
  //           body: 'Tu Reserva en el hotel Copo de Nieve ha sido cancelada!.\nSe ha reembolsado a tu cuenta de paypal la cantidad de: ' + this.difference + '\n\nMuchas gracias!!!',
  //           subject: 'Cancelacion de Reserva Hotel Copo de Nieve'
  //         };
  //         this.enviarCorreoCliente(myPayload);
  //       },
  //       (error) => {
  //         // Se produjo un error al procesar la devolución
  //         console.error('Error al realizar la devolución:', error);
  //         // Puedes notificar al usuario sobre el error aquí, por ejemplo, mostrando un mensaje en la interfaz de usuario
  //         alert('Error al realizar la devolución');
  //       }
  //     );
  // }

  onUserDelete() {

    this.realizarReembolso(this.refund);

    this.apiService.reservationDelete(this.reservation).subscribe({
      next: () => {
        console.log('Reservation deleted!');

        this.difference = (this.reservation.total_price).toString();

        const myPayload: Payload = {
          body: 'Tu Reserva' + this.reservation._id + ' en el hotel Copo de Nieve ha sido cancelada!.\nSe reembolsará a tu cuenta de paypal la cantidad de: ' + this.difference + '\n\nMuchas gracias!!!',
          subject: 'Cancelacion de Reserva Hotel Copo de Nieve'
        };
        this.enviarCorreoCliente(myPayload);

        //this.realizarDevolucion();
        this.router.navigate(['/delete']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data: ', error);
      }
    });

    
  }

  realizarReembolso(refund: Refund) {
    this.apiService.refundCreate(refund).subscribe({
      next: (response: Refund) => {
        console.log('Reembolso exitoso:', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al realizar el reembolso:', error);
        // Puedes notificar al usuario sobre el error aquí, por ejemplo, mostrando un mensaje en la interfaz de usuario
        alert('Error al realizar el reembolso');
      }
    });

  }

  guestQtyChange(event: any) {

    if (event.target.value > this.maxCapacity) {
      event.target.value = this.maxCapacity;
      this.reservation.qty_guests = this.maxCapacity;
      return;
    }
    if (event.target.value < this.minCapacity) {
      event.target.value = this.minCapacity;
      this.reservation.qty_guests = this.minCapacity;
      return;
    }
    this.reservation.qty_guests = event.target.value;
  }

  dateCheckInChange(event: any) {
    this.userStartDate = event.target.value;
  }

  dateCheckOutChange(event: any) {
    this.userEndDate = event.target.value;
  }

}
