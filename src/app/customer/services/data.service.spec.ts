import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Customer } from '../models/customer';

const customer: Customer = {
  id: '123',
  fullName: 'test test',
  email: 'test@test.te',
  address: {
    components: {
      street: 'test street',
      city: 'Testicity',
      zip: 'LT12345',
      houseNumber: '5D',
    },
    coordinates: '2.98324,94.47575'
  }
};

describe('DataService', () => {
  let service: DataService;
  const API_KEY = '1a98050698ad4a46bba11c37cad8ffc0';
  const URL_FOR_ADDRESS = 'https://api.geoapify.com/v1/geocode/search?';
  const URL_FOR_MAP = 'https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=300';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DataService);
  });

  beforeEach(() => {
    let store = {

    };
    spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
      return store[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should get coordinates with correct url', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      const response = {};

      service.getCoordinates('address').subscribe((v) => expect(v).toEqual(response));
      const req = httpMock.expectOne({
        url: `${URL_FOR_ADDRESS}text=address&apiKey=${API_KEY}`,
        method: 'GET',
      });
      req.flush(response);
    }
  ));

  it('Should return correct map url', () => {
    const response = service.getMapUrl('coordinates');
    expect(response).toEqual(`${URL_FOR_MAP}&center=lonlat:coordinates&zoom=15&apiKey=${API_KEY}`);
  });

  it('Should return existing customer info', () => {
    const customersArray = [];
    customersArray.push(customer);

    localStorage.setItem('customers', JSON.stringify(customersArray));

    const response = service.getCustomerById('123');
    expect(response).toEqual(customer);
  });

  it('Should return empty array as user does not exist', () => {
    const response = service.getCustomerById('134');
    expect(response).toBeNull();
  });

  it('Should save new customer', () => {
    service.saveCustomerInfo(customer, '123');
    const savedData = JSON.parse(localStorage.getItem('customers'));
    expect(savedData.length).toBe(1);
  });

  it('Should edit existing customer customer', () => {
    service.saveCustomerInfo(customer, '123');
    const editedCustomer = Object.assign({}, customer);
    editedCustomer.fullName = 'Trololo Test';
    service.saveCustomerInfo(editedCustomer, '123');

    const savedData = JSON.parse(localStorage.getItem('customers'));
    expect(savedData.length).toBe(1);
    const savedItem = savedData.find(c => c.id === '123');
    expect(savedItem.fullName).toEqual('Trololo Test');
  });

  it('Should edit existing customer customer', () => {
    service.saveCustomerInfo(customer, '123');
    const editedCustomer = Object.assign({}, customer);
    editedCustomer.fullName = 'Trololo Test';
    service.saveCustomerInfo(editedCustomer, '123');

    const savedData = JSON.parse(localStorage.getItem('customers'));
    expect(savedData.length).toBe(1);
    const savedItem = savedData.find(c => c.id === '123');
    expect(savedItem.fullName).toEqual('Trololo Test');
  });

  it('Should save two different customers', () => {
    service.saveCustomerInfo(customer, '123');
    const Customer2 = Object.assign({}, customer);
    Customer2.id = '456';
    service.saveCustomerInfo(Customer2, '456');

    const savedData = JSON.parse(localStorage.getItem('customers'));
    expect(savedData.length).toBe(2);
  });
});

