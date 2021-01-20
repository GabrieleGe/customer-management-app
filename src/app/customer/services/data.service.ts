import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../models/customer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  API_KEY = '1a98050698ad4a46bba11c37cad8ffc0';
  URL_FOR_ADDRESS = 'https://api.geoapify.com/v1/geocode/search?';
  URL_FOR_MAP = 'https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=300';

  constructor(private http: HttpClient) { }

  getCoordinates(address: string): Observable<any> {
    return this.http.get(`${this.URL_FOR_ADDRESS}text=${address}&apiKey=${this.API_KEY}`, httpOptions);
  }

  getMapUrl(coordinates: string): string {
    return `${this.URL_FOR_MAP}&center=lonlat:${coordinates}&zoom=15&apiKey=${this.API_KEY}`;
  }

  saveCustomerInfo(customerInfo: Customer, id: string): void {
    let custumersArray = [];
    console.log(localStorage.getItem('customers'));
    custumersArray = JSON.parse(localStorage.getItem('customers')) || [];
    const customerIndex = custumersArray.findIndex(c => c.id === id);
    customerIndex > -1 ? custumersArray[customerIndex] = customerInfo : custumersArray.push(customerInfo);
    localStorage.setItem('customers', JSON.stringify(custumersArray));
  }

  getCustomers(): Customer[] {
    return JSON.parse(localStorage.getItem('customers')) || [];
  }

  getCustomerById(id: string): Customer {
    const custumersArray = JSON.parse(localStorage.getItem('customers')) || [];

    return custumersArray.find(c => c.id === id);
  }
}
