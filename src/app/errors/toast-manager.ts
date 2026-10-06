import Swal from 'sweetalert2';

/**
 * Notificación de éxito no bloqueante (toast, esquina inferior derecha, se cierra sola) --
 * en vez de Swal.fire(title, text, 'success') a secas, que abre un modal que tapa la pantalla
 * y exige un click en "OK" para poder seguir trabajando. Mismo criterio que ErrorManager
 * (clase estática, un solo lugar para el estilo de notificación), pero para el caso de éxito.
 *
 * Guarda contexto real de trabajo (ej. una tarjeta de evaluación ya expandida en "Análisis del
 * GAP"): el modal bloqueante interrumpía el flujo en cada guardado.
 */
export class ToastManager {

  public static success(title: string): void {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }

}
