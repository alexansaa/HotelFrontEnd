import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, Reservation, Room, RoomCombination, RoomOccupancy, SearchRoomData } from '../models/MyData';

@Injectable({
  providedIn: 'root' // Adjust provider as needed
})
export class ApiService {
  constructor(private http: HttpClient) { }

  fetchData(): Observable<SearchRoomData[]> {
    // const apiUrl = 'https://backend-hr.onrender.com/'; // Replace with your API URL
    const apiUrl = 'http://localhost:5000/'; // Replace with your API URL
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
    // const apiUrl = 'https://backend-hr.onrender.com/find-rooms';
    const apiUrl = 'http://localhost:5000/find-rooms';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<RoomCombination[]>(apiUrl, datosBusqueda, options);
  }

  allBookings(): Observable<Reservation[]> {
    // const apiUrl = 'https://backend-hr.onrender.com/admin/bookings';
    const apiUrl = 'http://localhost:5000/admin/bookings';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<Reservation[]>(apiUrl, options);
  }

  allRooms(): Observable<Room[]> {
    // const apiUrl = 'https://backend-hr.onrender.com/rooms';
    const apiUrl = 'http://localhost:5000/rooms';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<Room[]>(apiUrl, options);
  }

  deleteRoom(id: string): Observable<void> {
    // const apiUrl = 'https://backend-hr.onrender.com/rooms/${id}';
    const apiUrl = 'http://localhost:5000/rooms/${id}';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete<void>(apiUrl, options);
  }

  selectRoom(id: string): Observable<Room> {
    // const apiUrl = 'https://backend-hr.onrender.com/rooms/${id}';
    const apiUrl = 'http://localhost:5000/rooms/' + id;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Room>(apiUrl, options);
  }

  updateRoom(room: RoomOccupancy): Observable<RoomOccupancy> {
    // const apiUrl = 'https://backend-hr.onrender.com/rooms/' + room._id;
    const apiUrl = 'http://localhost:5000/rooms/' + room._id;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<RoomOccupancy>(apiUrl, room, options);
  }

  reservationDelete(reservation: Reservation): Observable<Reservation> {
    // const apiUrl = 'https://backend-hr.onrender.com/admin/bookings/' + reservation._id;
    const apiUrl = 'http://localhost:5000/admin/bookings/' + reservation._id;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete<Reservation>(apiUrl, options);
  }

  reservationUpdate(reservation: Reservation): Observable<Reservation> {
    // const apiUrl = 'https://backend-hr.onrender.com/admin/bookings/' + reservation._id;
    const apiUrl = 'http://localhost:5000/admin/bookings/' + reservation._id;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Reservation>(apiUrl, reservation, options);
  }

  reservationSearch(reservationId: string): Observable<Reservation> {
    // const apiUrl = 'https://backend-hr.onrender.com/user/bookings/' + reservationId;
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
    // const apiUrl = 'https://backend-hr.onrender.com/user/bookings';
    const apiUrl = 'http://localhost:5000/user/bookings';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // This header might not be necessary for GET requests
      })
    };

    return this.http.post<Booking>(apiUrl, booking, options);
  }


}