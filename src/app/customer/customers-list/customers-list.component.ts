import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  breakpoint: number;
  customers: Customer[];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.getAllCustomers();
    this.breakpoint = window.innerWidth <= 900 ? 1 : window.innerWidth <= 1600 ? 2 : 3;

  }
  onResize(event): void {
    this.breakpoint = event.target.innerWidth <= 900 ? 1 : event.target.innerWidth <= 1600 ? 2 : 3;
  }

  getAllCustomers(): void {
    this.customers = this.data.getCustomers();
  }
}
