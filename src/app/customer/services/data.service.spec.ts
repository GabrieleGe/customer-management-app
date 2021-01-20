import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

const localStorageMock = `[{"fullName":"Lukas Kiausinis","email":"lukas.kiausinis@gmail.com","address":{"city":"Vilnius","street":"Filaretu","houseNumber":"43","zip":"12345","coordinates":"25.312966,54.685337"},"id":"7163b428-92ba-9ce0-798d-944e1ae2f37d"}]`;

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
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return localStorageMock;
    });
    const customer = service.getCustomerById('123');
    expect(customer).toEqual(JSON.parse(localStorageMock));
  });
});

