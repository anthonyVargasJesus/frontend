import Swal from 'sweetalert2';


export class ErrorManager {

  public static handleError(err) {

    console.log('error', err);

    if (err.status === 500) {
      Swal.fire(err.statusText, 'Hubo un error en el servidor', 'error');
      return;
    }

    if (err.status === 0) {
      Swal.fire(err.statusText, 'Hubo un error desconocido', 'error');
      return;
    }

    if (err.status === 400) {


      console.log('eeee', err);
      let errors = [];
      errors = err.error.errors;
      let title = 'Error';
      if (err.error.title)
        title = err.error.title
      var result = errors.map((item) => { return item.detail }).join('<br>');
      Swal.fire(title, result.toString(), 'error');

      return;
    }



  }


}