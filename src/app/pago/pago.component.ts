import { Component, OnInit } from '@angular/core';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface OrderData {
    orderId: string;
    // ... Otros campos de tu orden
}


interface Room {
    _id: number;
    description: string;
    price: number;
    qty_beds: number;
    room_type: string;
  }

@Component({
    selector: 'app-pago',
    standalone: true,
    imports: [NgxPayPalModule, RouterModule],
    templateUrl: './pago.component.html',
    styleUrls: ['./pago.component.css']
})

export class PagoComponent implements OnInit {

    public payPalConfig?: IPayPalConfig;

    // Variables para almacenar los datos recuperados
    checkinDate: string = '';
    checkoutDate: string = '';
    roomId: number = 0;
    roomType: string = '';
    individualPrice: number = 0;
    numberOfBeds: number = 0;
    totalPeople: number = 0;

    constructor(private router: Router, private http: HttpClient) { } // Inyecta HttpClient aquí

    ngOnInit(): void {
        this.initConfig();
        this.recuperarDatos();
    }

    private recuperarDatos(): void {
        
    }

    private initConfig(): void {
        const combinacionString = localStorage.getItem('combinacion');
        console.log('combinacionString', combinacionString);

        // const combinacion: any = JSON.parse(combinacionString);


        // // Recuperar fechas de check-in y check-out
        // this.checkinDate = combinacion.checkin_date;
        // this.checkoutDate = combinacion.checkout_date;

        // // Sumar la cantidad de habitaciones
        // const totalRooms: number = combinacion.rooms.length;

        // Calcular el precio final
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
                    recipient: "pablodarcos.723@gmail.com",
                    body: "Tu pago ha sido procesado correctamente." + costoRecuperado,
                    subject: "Confirmación de Pago"
                };
                this.http.post('http://localhost:5000/send_email', emailData).subscribe({
                    next: (response) => {
                        console.log('Correo de confirmación enviado', response);
                        this.router.navigate(['/']);
                    },
                    error: (error) => {
                        console.error('Error al enviar el correo de confirmación', error);
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
}

