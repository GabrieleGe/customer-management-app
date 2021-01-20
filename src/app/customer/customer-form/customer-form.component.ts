import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  existingCustomer: Customer;
  locationError = false;
  existingCustomerId: string;

  constructor(
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.customerForm = this.setupForm();
    this.existingCustomerId = this.route.snapshot.paramMap.get('id');
    if (this.existingCustomerId) {
      this.existingCustomer = this.data.getCustomerById(this.existingCustomerId);
      this.customerForm.patchValue(this.existingCustomer);
      this.customerForm.updateValueAndValidity();
    }

    const resetCoordinates = merge(...[
      this.customerForm.get('address.street').valueChanges,
      this.customerForm.get('address.city').valueChanges,
      this.customerForm.get('address.houseNumber').valueChanges,
      this.customerForm.get('address.zip').valueChanges]
    );

    resetCoordinates.subscribe(() => {
      this.locationError = false;
      this.customerForm.get('address.coordinates').setValue('');
      this.customerForm.updateValueAndValidity();
    });
  }


  checkAddressValidity(): boolean {
    if (this.isAddressFull()) {
      const address = this.getFullAddress();
      this.data.getCoordinates(address).subscribe(
        data => {
          this.openDialog(data.features[0].geometry.coordinates.toString());
        },
        () => this.locationError = true);
    }
    return true;
  }

  onSubmit(): void {
    this.customerForm.markAllAsTouched();
    this.customerForm.get('address.coordinates').invalid ? this.locationError = true : this.locationError = false;
    if (this.customerForm.valid) {
      const cusomerData = { ...this.customerForm.value };
      cusomerData.id = this.existingCustomerId || Guid.create().toString();

      this.data.saveCustomerInfo(cusomerData, cusomerData.id);
      this.router.navigate(['customer/list']);
    }
  }

  private openDialog(coordinates: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      coordinates
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => data ? this.customerForm.get('address.coordinates').setValue(data) : this.locationError = true,
      () => this.locationError = true
    );
  }

  private setupForm(): FormGroup {
    return new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('.+ .+'),
        Validators.maxLength(40)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      address: new FormGroup({
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40)
          ]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]),
        houseNumber: new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.minLength(1),
          Validators.maxLength(10)
        ]),
        zip: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20)
        ]),
        coordinates: new FormControl('', Validators.required)
      })
    });

  }

  private isAddressFull(): boolean {
    return this.customerForm.get('address.city').valid &&
      this.customerForm.get('address.street').valid &&
      this.customerForm.get('address.houseNumber').valid &&
      this.customerForm.get('address.zip').valid;
  }

  private getFullAddress(): string {
    return this.customerForm.get('address.city').value + ' ' +
      this.customerForm.get('address.street').value + ' ' +
      this.customerForm.get('address.houseNumber').value + ' ' +
      this.customerForm.get('address.zip').value;
  }

}
