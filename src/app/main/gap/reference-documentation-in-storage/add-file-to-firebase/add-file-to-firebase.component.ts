import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { LoginService } from 'app/services/login.service';
import { LoginModel } from 'app/models/login-model';


@Component({
  selector: 'app-add-file-to-firebase',
  templateUrl: './add-file-to-firebase.component.html',
  styles: [
  ]
})

export class AddFileToFirebaseComponent implements OnInit {

  id: string;
  imagenSubir: File;
  imagenTemp: string = 'assets/images/no-image.png';
  loading = false;
  loading2 = false;

  currentLoginModel: LoginModel = new LoginModel();

  constructor(private storage: AngularFireStorage, public dialogRef: MatDialogRef<AddFileToFirebaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _loginService: LoginService) { }

  ngOnInit(): void {
    this.currentLoginModel = this._loginService.getCurrentUser();
  }

  seleccionImage(archivo: File) {

    if (!archivo) {
      this.imagenSubir = null;
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
      const fileExtension = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExtension}`;

      let filePath = '';

      if (this.currentLoginModel)
        filePath = `evidences/${this.currentLoginModel.companyId}/${fileName}`;

      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(finalize(() => {

        ref.getDownloadURL().subscribe(url => {

          this.loading2 = false;
          this.dialogRef.close({ updated: true, url: url });

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
