import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-modal-image-user',
  templateUrl: './modal-image-user.component.html',
  styles: [
  ]
})
export class ModalImageUserComponent implements OnInit {

  id: string;
  imagenSubir: File;
  imagenTemp: string = 'assets/images/no-image.png';
  loading = false;
  user: User;
  loading2 = false;

    
  constructor(private storage: AngularFireStorage, public userService: UserService, public dialogRef: MatDialogRef<ModalImageUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.initUser();
    this.id = this.data['userId'];


    this.obtain(this.id);
  }

  initUser() {
    this.user = new User();
  }

  obtain(id: string) {
    this.loading = true;
    this.userService.obtain(id)
      .subscribe((res: any) => {
        this.user = res.data;

        if (this.user.image)
          this.imagenTemp = this.user.image;

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  seleccionImage(archivo: File) {

    if (!archivo) {
      this.imagenSubir = null;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire('Sólo puede seleccionar imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
      this.imagenTemp = reader.result.toString();
    };

  }


  subirImagen() {

    try {
      this.loading2 = true;
      const id = this.id;

      const file = this.imagenSubir;
      const fileName = `${id}`;

      const filePath = 'users' + '/' + fileName;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(finalize(() => {

        ref.getDownloadURL().subscribe(urlImage => {

          let user = new User();
          user.userId = Number(this.id);
          user.name = this.user.name;
          user.firstName = this.user.firstName;
          user.image = urlImage;

          this.userService.updateImage(user)
            .subscribe(update => {
              this.loading2 = false;
              this.dialogRef.close({ image: urlImage });
            }, error => {
              this.loading2 = false;
              ErrorManager.handleError(error);
            });

        }, error => {
          this.loading2 = false;
          ErrorManager.handleError(error);
        });

      })).subscribe();

    } catch (error) {
      this.loading2 = false;
      ErrorManager.handleError(error,);
    }

  }

  close() {
    this.dialogRef.close();
  }

}
