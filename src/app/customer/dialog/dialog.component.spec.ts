import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { DialogComponent } from './dialog.component';

const mockDialogRef = {
  close(dialogResults?: any): void { }
};

const data = {
  coordinates: '2.98324,94.47575'
};

const dataServiceStub = {
  getMapUrl(coordinates: string): string {
    return 'test';
  },
};

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      schemas: [NO_ERRORS_SCHEMA],

      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: DataService,
          useValue: dataServiceStub
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with no parameters', () => {
    spyOn(mockDialogRef, 'close');
    component.incorrectAddress();
    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should close dialog with coordinates passed', () => {
    spyOn(mockDialogRef, 'close');
    component.correctAddress();
    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith('2.98324,94.47575');
  });
});
