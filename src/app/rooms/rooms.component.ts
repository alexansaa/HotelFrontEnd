import { Component, Input, OnInit, input } from '@angular/core';
import { Room } from '../models/MyData';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit{
  @Input() room!: Room;

  constructor() {}

  ngOnInit() {
    // Fetch data from API or service and assign it to responseData
    // Example: this.responseData = // ... fetch data logic ...
  }
}
