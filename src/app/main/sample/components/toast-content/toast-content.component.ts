import { Component,Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface ToastData {
  type: 'success' | 'error' | 'info' | 'warning' | 'wait';
  title: string;
  message: string;
  icon?: string; // Opcional: para usar un icono de Material Icons
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-toast-content',
  templateUrl: './toast-content.component.html',
  styleUrls: ['./toast-content.component.scss']
})
export class ToastContentComponent implements OnInit {

   constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData) { }

  ngOnInit(): void {
    console.log('data', this.data.type);
  }

}
