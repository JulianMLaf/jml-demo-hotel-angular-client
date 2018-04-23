import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private http: Http) { }

  private baseUrl = 'http://localhost:8080';
  private getUrl: string = this.baseUrl + '/room/reservation/v1/';
  private postUrl: string = this.baseUrl + '/room/reservation/v1';
  public submitted: boolean;
  roomsearch: FormGroup;
  rooms: Room[];
  request: ReserveRoomRequest;
  currentCheckInVal: string;
  currentCheckOutVal: string;
  ngOnInit() {
    console.log('start App');
    this.roomsearch = new FormGroup({
      checkin: new FormControl(''),
      checkout: new FormControl('')
    });

    const roomsearchValueChanges$ = this.roomsearch.valueChanges;
    roomsearchValueChanges$.subscribe(
      valChange => {
        this.currentCheckInVal = valChange.checkin;
        this.currentCheckOutVal = valChange.checkout;
      });
  }


  onSubmit({ value, valid }: { value: RoomSearch, valid: boolean }) {
    this.getAll()
      .subscribe(rooms => this.rooms = rooms,
        err => { console.log(err); });
  }

  reserveRoom(value: string) {
    this.request = new ReserveRoomRequest(value, this.currentCheckInVal, this.currentCheckOutVal);

    this.createReservation(this.request);

  }

  getAll(): Observable<Room[]> {
    console.log('Chekin: ' + this.currentCheckInVal);
    console.log('Chekout: ' + this.currentCheckOutVal);
    return this.http
    .get(this.getUrl + '?checkin=' + this.currentCheckInVal + '&checkout=' + this.currentCheckOutVal)
      .map(this.mapRoom);
  }

  createReservation(body: ReserveRoomRequest) {
    const bodyString = JSON.stringify(body);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers}); // Create a request option

    this.http.post(`${this.baseUrl}/room/reservation/v1`, body, options)
    .subscribe(res => console.log(res));
  }
  mapRoom(response: Response): Room[] {
    console.log(response.json());
    return response.json().content;
  }
}
export interface RoomSearch {
  checkin: string;
  checkout: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  price: string;
  links: string;
}

export class ReserveRoomRequest {
  roomId: string;
  checkin: string;
  checkout: string;

  constructor(roomId: string,
    checkin: string,
    checkout: string) {
    this.roomId = roomId;
    this.checkin = checkin;
    this.checkout = checkout;
  }
}

