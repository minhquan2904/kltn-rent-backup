import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader, AgmCircle, AgmMap } from '@agm/core';

import { MotelService } from '../../../_services/index';
@Component({
  selector: 'app-map-marker-move',
  templateUrl: './map-marker-move.component.html',
  styleUrls: ['./map-marker-move.component.css']
})
export class MapMarkerMoveComponent implements OnInit {
  @Output() locationChild: EventEmitter<any> = new EventEmitter<any>();

  data: any = {};
  public showCircle: Boolean = false;
  public latitude: number;
  public radius: Number = 5;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  checkCurrentPage = true;
  listLocation: Array<any> = [];
  // circle properties
  public circleProps = {
    fillColor : '#FF0000',
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
  };
  @Input() myData;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private motelService: MotelService) { }

  ngOnInit() {
    // set google maps defaults
    this.zoom = 12;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.data.distance = 5;
    // set current position
      this.setCurrentPosition();
    // create search FormControl
    this.searchControl = new FormControl();
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          localStorage.setItem('lat', place.geometry.location.lat().toString() );
          localStorage.setItem('lng', place.geometry.location.lng().toString() );
          this.data.lat = this.latitude = place.geometry.location.lat();
          this.data.lng =  this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          // /this.latlngChild.emit(this.data);
        });
      });
    });
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
         // set latitude, longitude and zoom
         this.data.lat = this.latitude = position.coords.latitude;
         this.data.lng =  this.longitude = position.coords.longitude;
         this.zoom = 12;
        //  this.latlngChild.emit(this.data);
      });
    }

  }

  onMapClick($event) {
    // console.log($event.coords.lat);
    // console.log($event.coords.lng);
    const geocoder = new google.maps.Geocoder;
    const latlng = new google.maps.LatLng($event.coords.lat, $event.coords.lng);

    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status.toString() === 'OK') {
        this.data.lat = this.latitude = results[0].geometry.location.lat();
        this.data.lng = this.longitude = results[0].geometry.location.lng();
        // this.latlngChild.emit(this.data);
        this.zoom = 13;
      }
    });
  }

  onSearchClick() {
    this.listLocation = [];
    this.radius = this.data.distance;
    this.showCircle = true;
    this.motelService.getListNearBy(this.data).subscribe(res => {
      this.locationChild.emit(res);
      this.zoom = 13;
      res.map( item => {
        let location: any = item;
        location.lat = Number.parseFloat(item.lat.toString());
        location.lng = Number.parseFloat(item.lng.toString());
        this.listLocation.push(location);
      });
    });
  }

}
