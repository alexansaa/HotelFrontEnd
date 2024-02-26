import { Component, OnInit, Injectable } from '@angular/core';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../rooms_services/api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoomOccupancy } from '../models/MyData';
import { v4 as uuidv4 } from 'uuid';


interface Room {
    _id: string;
    description: string;
    price: number;
    qty_beds: number;
    room_type: string;
}

@Component({
    selector: 'app-pago',
    standalone: true,
    imports: [NgxPayPalModule, RouterModule, NgFor],
    templateUrl: './pago.component.html',
    styleUrls: ['./pago.component.css']
})

export class PagoComponent implements OnInit {

    combinacion: any;
    fechas: any;
    costoCombinacion: any;
    usuario: any;

    public payPalConfig?: IPayPalConfig;

    // Variables para almacenar los datos recuperados
    // checkinDate: string = '';
    // checkoutDate: string = '';
    // roomId: number = 0;
    // roomType: string = '';
    // individualPrice: number = 0;
    // numberOfBeds: number = 0;
    // totalPeople: number = 0;

    constructor(private router: Router, private http: HttpClient, private apiService: ApiService) { } // Inyecta HttpClient aquí

    ngOnInit(): void {
        const fechasString = localStorage.getItem('fechas');
        if (fechasString) {
            this.fechas = JSON.parse(fechasString);
        }

        const costoCombinacionString = localStorage.getItem('costoCombinacion');
        if (costoCombinacionString) {
            this.costoCombinacion = costoCombinacionString;
        }

        const usuarioString = localStorage.getItem('usuario');
        if (usuarioString) {
            this.usuario = JSON.parse(usuarioString); // Parsea el usuario completo
        }


        const combinacion = localStorage.getItem('combinacion');
        if (combinacion) {
            this.combinacion = JSON.parse(combinacion);
        }

        console.log(this.usuario)


        this.initConfig();
    }



    private initConfig(): void {
        const combinacionString = localStorage.getItem('combinacion');

        console.log("Usuario id: " + this.usuario._id);

        const bookingData = {
            _id: uuidv4(),
            user_id: this.usuario._id,
            checkin_date: this.fechas.start_date,
            checkout_date: this.fechas.end_date,
            qty_guests: this.fechas.num_people,
            rooms: this.combinacion.rooms.map((room: Room) => (room._id)),
            // this.rooms.map((room, index) => (room._id === firstRoomId ? index : null)).filter(index => index !== null);
            // rooms: this.combinacion.rooms,
            total_price: this.costoCombinacion
        }


        console.log('Datos de la reserva:', bookingData);

        const costoRecuperado = localStorage.getItem('costoCombinacion');
        this.payPalConfig = {
            currency: 'USD',
            clientId: 'ASDlG6RI5mkZWEgxorLCeLUC0o9mDCX-rT8wWr99HplGw1yHDpEKmavutkGP8cm5c7bODWUbHcB01nDa',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: costoRecuperado,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: costoRecuperado
                            }
                        }
                    },
                    items: [{
                        name: 'Reserva de habitación Copo de Nieve',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'USD',
                            value: costoRecuperado,
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
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - transacción completada', data);
                const emailData = {
                    recipient: this.usuario.email,
                    body: "Gracias por su reserva en Hotel Copo de Nieve.\nDetalles de su reserva:\nId Reserva:" + bookingData._id + "\nFecha de Checkin: " + bookingData.checkin_date + "\nFecha de Checkout: " + bookingData.checkout_date + "\nHabitaciones: " + bookingData.rooms + "\nNúmero de huéspedes: " + bookingData.qty_guests + "\nPrecio Total: " + costoRecuperado,
                    subject: "Confirmación de Reserva Hotel Copo de Nieve"
                };
                this.http.post('http://localhost:5000/send_email', emailData).subscribe({
                    next: (response) => {
                        console.log('Correo de confirmación enviado', response);
                        this.router.navigate(['/confirmacion']);
                    },
                    error: (error) => {
                        console.error('Error al enviar el correo de confirmación', error);
                    }
                });

                // Creo la reserva en la colección de reservas


                
                this.apiService.reservationCreate(bookingData).subscribe({
                    next: () => {
                        // Handle successful response here
                        console.log('Reserva creada correctamente:', bookingData);

                    },
                    error: (error: HttpErrorResponse) => {
                        // Handle errors gracefully
                        console.error('Error fetching data:', error);
                        // Display an error message to the user
                    }
                });

                // Crear objetos RoomOccupancy para cada habitación reservada
                const roomOccupancies: RoomOccupancy[] = [];
                this.combinacion.rooms.forEach((room: Room) => {
                    const roomOccupancy: RoomOccupancy = {
                        _id: room._id.toString(),
                        checkin_date: this.fechas.start_date,
                        checkout_date: this.fechas.end_date // Asignamos las fechas de check-in y check-out
                    };
                    roomOccupancies.push(roomOccupancy);
                });

                // Actualizar las habitaciones en el servidor
                roomOccupancies.forEach((roomOccupancy: RoomOccupancy) => {
                    console.log("Id del cuarto: " + roomOccupancy._id);
                    this.apiService.updateRoom(roomOccupancy).subscribe({
                        next: () => {
                            console.log('Habitación actualizada correctamente:', roomOccupancy);
                        },
                        error: (error: HttpErrorResponse) => {
                            console.error('Error al actualizar la habitación:', error);
                        }
                    });
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
}

