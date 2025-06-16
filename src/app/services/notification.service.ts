import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastContentComponent, ToastData } from 'app/main/sample/components/toast-content/toast-content.component';


@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  private openCustomSnackBar(data: ToastData, config?: MatSnackBarConfig): void {
    const defaultConfig: MatSnackBarConfig = {
      duration: 3000, // Duración por defecto
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar-container'], // Clase para el contenedor global del snackbar
      ...config // Sobrescribir con la configuración provista
    };

    this.snackBar.openFromComponent(ToastContentComponent, {
      data: data,
      ...defaultConfig
    });
  }

  showSuccess(title: string, message: string, duration: number = 3000): void {
    this.openCustomSnackBar({ type: 'success', title, message, showCloseButton: false }, { duration });
  }

  showError(title: string, message: string, duration: number = 5000): void {
    this.openCustomSnackBar({ type: 'error', title, message, showCloseButton: true }, { duration });
  }

  showInfo(title: string, message: string, duration: number = 3000): void {
    this.openCustomSnackBar({ type: 'info', title, message, showCloseButton: false }, { duration });
  }

  showWarning(title: string, message: string, duration: number = 4000): void {
    this.openCustomSnackBar({ type: 'warning', title, message, showCloseButton: true }, { duration });
  }

  showWait(title: string, message: string, duration: number = 0): void { // Duración 0 para que no se cierre automáticamente
    this.openCustomSnackBar({ type: 'wait', title, message, showCloseButton: false }, { duration });
  }

  // Puedes añadir un método para cerrar específicamente si tienes un toast de 'espera'
  dismissAll(): void {
    this.snackBar.dismiss();
  }

}
