import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-prepago',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './prepago.component.html',
  styleUrl: './prepago.component.css'
})
export class PrepagoComponent implements OnInit {
  // Declarar las variables para almacenar los valores de los campos del formulario
  tipoDocumento: string = '';
  documento: string = '';
  nombre: string = '';
  apellido: string = '';
  correoElectronico: string = '';
  numeroTelefono: string = ''; 
  fechaNacimiento: string = ''; 

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submitForm(): void {

    console.log('tipoDocumento', this.tipoDocumento);
    console.log('documento', this.documento);
    console.log('nombre', this.nombre);

    // if (!this.nombre || !this.apellido || !this.correoElectronico || !this.numeroTelefono || !this.fechaNacimiento) {
    //   alert('Por favor completa todos los campos.');
    //   return;
    // }
    console.log('fechaNacimiento', this.fechaNacimiento);
    const today = new Date();
    const birthDate = new Date(this.fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    console.log('age', age);
    // const month = today.getMonth() - birthDate.getMonth();
    // if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    //   age--;
    // }

    if (age < 18) {
      alert('Debes ser mayor de 18 años para continuar.');
      return;
    }

    // Aquí puedes agregar la lógica para enviar el formulario al backend o realizar otras acciones necesarias
    this.router.navigate(['/pago']);

    const datosUsuario = {
      _id: this.documento,
      type_id: this.tipoDocumento,      
      name: this.nombre,
      lastname: this.apellido,
      email: this.correoElectronico,
      phone_number: this.numeroTelefono,
      birth: this.fechaNacimiento 
    };

    var usuario = datosUsuario;
    const usuarioString = JSON.stringify(usuario);

    localStorage.setItem('usuario', usuarioString);
    console.log('usuario: ', usuarioString);
  }



}
