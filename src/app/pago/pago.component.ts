import { Component, OnInit } from '@angular/core';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest  } from 'ngx-paypal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  Router, RouterModule } from '@angular/router';

interface OrderData {
  orderId: string;
  // ... Otros campos de tu orden
}

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [NgxPayPalModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit{

  public payPalConfig ? : IPayPalConfig;
  
  constructor(private router: Router) { }


    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: 'USD',
            clientId: 'ASDlG6RI5mkZWEgxorLCeLUC0o9mDCX-rT8wWr99HplGw1yHDpEKmavutkGP8cm5c7bODWUbHcB01nDa',
            createOrderOnClient: (data) => < ICreateOrderRequest > {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '0.99',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '0.99'
                            }
                        }
                    },
                    items: [{
                        name: 'Reserva de habitación Copo de Nieve',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'USD',
                            value: '0.99',
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
                





            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                // Redirect to the /home page after successful payment approval
                this.router.navigate(['/']);
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


