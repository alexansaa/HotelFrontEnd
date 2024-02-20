import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(
    private router: Router
  ){ }

  onSubmit() {
    console.log(this.username);
    console.log(this.password);
    this.router.navigate(['/adminHome']);
  }
}
