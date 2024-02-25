export interface SearchRoomData {
    num_people: number;
    start_date: Date;
    end_date: Date;
    num_rooms: number;
}

export interface RoomCombination {
    total_capacity: any;
    excess_capacity: any;
    rooms: Room[];
    capacity: any;
    name: any;
    num_people: number;
    start_date: Date;
    end_date: Date;
    num_rooms: number;
    _id: string,
    description: string,
    occupancy: number,
    people_capacity: number,
    price: number,
    qty_beds: number,
    room_type: string,
    size: number,
    images: string

}

export interface Room {
    _id: string,
    description: string,
    occupancy: number,
    people_capacity: number,
    price: number,
    qty_beds: number,
    room_type: string,
    size: number,
    images: string
}

export interface Reservation {
    _id: string,
    user_id: string,
    checkin_date: Date,
    checkout_date: Date,
    qty_guests: number,
    rooms: [],
    total_price: number,
    admin: boolean
}

export interface Booking {
    user_id: string,
    checkin_date: Date,
    checkout_date: Date,
    qty_guests: number,
    rooms: [],
    total_price: number,
}
