import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  mapUrl: string;
  coordinates: string;

  constructor(
    private dataService: DataService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.coordinates = data.coordinates;
  }

  ngOnInit(): void {
    this.mapUrl = this.dataService.getMapUrl(this.coordinates);
  }

  incorrectAddress(): void {
    this.dialogRef.close();
  }

  correctAddress(): void {
    this.dialogRef.close(this.coordinates);
  }
}
