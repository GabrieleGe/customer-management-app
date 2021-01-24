import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  customers: Customer[];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers(): void {
    this.customers = this.data.getCustomers();
  }
}
