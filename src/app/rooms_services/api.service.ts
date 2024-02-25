import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, Reservation, Room, RoomCombination, SearchRoomData } from '../models/MyData';

@Injectable({
  providedIn: 'root' // Adjust provider as needed
})
export class ApiService {
  constructor(private http: HttpClient) { }

  fetchData(): Observable<SearchRoomData[]> {
    const apiUrl = 'http://localhost:5000'; // Replace with your API URL
    let ans = this.http.get<SearchRoomData[]>(apiUrl);
    console.log(ans);
    return ans;
  }

  searchRoomsCombinations(datosBusqueda: {
    num_people: number,
    start_date: Date,
    end_date: Date,
    num_rooms: number
  }): Observable<RoomCombination[]> {
    const apiUrl = 'http://localhost:5000/find-rooms';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<RoomCombination[]>(apiUrl, datosBusqueda, options);
  }

  allBookings(): Observable<Reservation[]> {
    const apiUrl = 'http://localhost:5000/admin/bookings';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<Reservation[]>(apiUrl, options);
  }

  deleteRoom(id: string): Observable<void> {
    const apiUrl = 'http://localhost:5000/rooms/${id}';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete<void>(apiUrl, options);
  }

  selectRoom(id: string): Observable<Room> {
    const apiUrl = 'http://localhost:5000/rooms/${id}';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Room>(apiUrl, options);
  }

  updateRoom(room: Room): Observable<Room> {
    const apiUrl = 'http://localhost:5000/rooms/${room._id}';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Room>(apiUrl, room, options);
  }

  reservationUpdate(reservation: Reservation): Observable<Reservation> {
    const apiUrl = 'http://localhost:5000/admin/booking/${reservation._id}';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Reservation>(apiUrl, reservation, options);
  }

  reservationSearch(reservationId: string): Observable<Reservation> {
    const apiUrl = 'http://localhost:5000/user/bookings/' + reservationId;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // This header might not be necessary for GET requests
      })
    };

    // Change PUT to GET
    return this.http.get<Reservation>(apiUrl, options);
  }

  reservationCreate(booking: Booking): Observable<Booking> {
    const apiUrl = 'http://localhost:5000/user/bookings';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // This header might not be necessary for GET requests
      })
    };

    return this.http.post<Booking>(apiUrl, options);
  }


}