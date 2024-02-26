import { Component, Input, OnInit, input } from '@angular/core';
import { Room } from '../models/MyData';
import { NgFor } from '@angular/common';
import { ApiService } from '../rooms_services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent{
  @Input() room!: Room;
  
}
