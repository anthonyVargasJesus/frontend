import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-demo-detalle-repairs',
  templateUrl: './demo-detalle-repairs.component.html',
  styles: [
  ]
})
export class DemoDetalleRepairsComponent implements OnInit {

  path: string = '';
  name: string = '';

  constructor( private dialogRef: MatDialogRef<DemoDetalleRepairsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,) { }

  ngOnInit(): void {
    this.path = this.data['path'];
    this.name = this.data['name'];
  }

  add(){

  }

  delete(){

  }

  edit(){

  }

  close() {
    this.dialogRef.close();
  }

}
