import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { TestComponent } from 'src/app/testing/components/testing.component';
import { AddressComponents } from '../models/address-components';
import { Customer } from '../models/customer';
import { DataService } from '../services/data.service';
import { CustomerFormComponent } from './customer-form.component';

const customerMock = {
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

const dataServiceStub = {
  getCoordinates(address: string): Observable<any> {
    return of({
      features: [{
        geometry: {
          coordinates: [[2.98324, 94.47575]]
        }
      }]
    });
  },
  saveCustomerInfo(customerInfo: Customer, id: string): void { },
  getCustomerById(id: string): Customer {
    return { ...customerMock, id };
  }
};

const addressComponenrMock: AddressComponents = {
  city: 'Vilnius',
  street: 'Kalvariju',
  houseNumber: '10',
  zip: 'LT12345'
};

const mockDialogRef = {
  open(component, dialogConfig): any { },
  afterClosed(): Observable<any> { return of(); },
  close(dialogResults?: any): void { }
};

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [CustomerFormComponent, TestComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'customer/list', component: TestComponent }]
        ),
        MatDialogModule,
        BrowserAnimationsModule,

      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: DataService,
          useValue: dataServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 123 })
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(done);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.customerForm.reset();
    component.customerForm.updateValueAndValidity();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFullAddress and return valid string', () => {
    component.customerForm.get('address.components').setValue(addressComponenrMock);
    expect(component.getFullAddress()).toEqual('Vilnius Kalvariju 10 LT12345');
  });

  it('should call checkAddressValidity with valid form and open Dialog with correct coordinates', () => {
    spyOn(component, 'openDialog');
    component.customerForm.get('address.components').setValue(addressComponenrMock);
    component.checkAddressValidity();
    expect(component.openDialog).toHaveBeenCalledWith([[2.98324, 94.47575]].toString());
  });

  it('should call checkAddressValidity with invalid form', () => {
    spyOn(component, 'openDialog');
    component.checkAddressValidity();
    expect(component.openDialog).toHaveBeenCalledTimes(0);
  });

  it('should call onSubmit with valid form', () => {
    spyOn(dataServiceStub, 'saveCustomerInfo');
    component.customerForm.patchValue(customerMock);
    component.onSubmit();
    expect(dataServiceStub.saveCustomerInfo).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with invalid form. SaveCustomerInfo should not be called', () => {
    spyOn(dataServiceStub, 'saveCustomerInfo');
    component.onSubmit();
    expect(dataServiceStub.saveCustomerInfo).toHaveBeenCalledTimes(0);
  });

});
