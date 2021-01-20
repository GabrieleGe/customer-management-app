import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { Customer } from '../models/customer';
import { DataService } from '../services/data.service';

import { CustomerFormComponent } from './customer-form.component';

const dataServiceStub = {
  getCoordinates(address: string): any {
    return of(
      {
        features: [
          {
            geometry: {
              coordinates: [[2.98324, 94.47575]]
            }
          }
        ]
      }
    );
  },
  saveCustomerInfo(customerInfo: Customer, id: string): void { },
  getCustomerById(id: string): Customer {
    return {
      id,
      fullName: 'test test',
      email: 'test@test.te',
      address: {
        street: 'test street',
        city: 'Testicity',
        zip: 'LT12345',
        houseNumber: '5D',
        coordinetes: '2.98324,94.47575'
      }
    };
  }
};

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerFormComponent],
      imports: [
        RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
        MatDialogModule,

      ],
      providers: [
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
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
