import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Customer } from '../models/customer';
import { DataService } from '../services/data.service';
import { CustomersListComponent } from './customers-list.component';

const dataServiceStub = {
  getCustomers(): Customer[] {
    return [];
  },
};

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: DataService,
          useValue: dataServiceStub
        },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
