import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  center = { latitude: 0, longitude: 0 };

  constructor() { }

  //funcion tipo callback del api del navegador no responde nada, pero puede ser probado
  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((response) => {
      const { latitude, longitude } = response.coords;
      this.center = { latitude: latitude, longitude: longitude };

    });
  }
}
