import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/MyData';
import { ApiService } from '../rooms_services/api.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-prepago',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './prepago.component.html',
  styleUrl: './prepago.component.css'
})
export class PrepagoComponent implements OnInit {
  // Declarar las variables para almacenar los valores de los campos del formulario
  myUsuario: User = {
    _id: '',
    type_id: '',
    name: '',
    lastname: '',
    email: '',
    phone_number: '', 
    birth: '', 
  };

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    // console.log('tipoDocumento', this.myUsuario.type_id);
    // console.log('documento', this.myUsuario._id);
    // console.log('nombre', this.myUsuario.name);
    // console.log('fechaNacimiento', this.myUsuario.birth);

    const today = new Date();
    const birthDate = new Date(this.myUsuario.birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    // console.log('age', age);
    if (age < 18) {
      alert('Debes ser mayor de 18 años para continuar.');
      return;
    }

    this.router.navigate(['/pago']);

    this.apiService.createUser(this.myUsuario).subscribe({
      next: (response: User) => {
        console.log("Usuario creado con exito!");
        //
        const usuarioString = JSON.stringify(this.myUsuario);
        localStorage.setItem('usuario', usuarioString);
        console.log('usuario: ', usuarioString);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
      }
    });
  }
}
