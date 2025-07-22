import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { UserFirebase } from 'app/models/user-firebase.interface';




@Injectable({ providedIn: 'root' })
export class AuthService {


    public user$: Observable<UserFirebase>;

    constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {

        this.user$ = this.afAuth.authState.pipe(
            switchMap((user) => {
                if (user) {
                    return this.afs.doc<UserFirebase>(`users/${user.uid}`).valueChanges();
                }
                return of(null);
            })
        );
    }

    async resetPassword(email: string): Promise<void> {
        try {
            return this.afAuth.sendPasswordResetEmail(email);
        } catch (error) {

        }
    }

    async sendVerificationEmail(): Promise<void> {
        try {
            return (await this.afAuth.currentUser).sendEmailVerification();
        } catch (error) {

        }


    }

    async login(email: string, password: string): Promise<UserFirebase> {
        try {
            const { user } = await this.afAuth.signInWithEmailAndPassword(
                email,
                password
            );

            return user;
        } catch (error) {
            var json = JSON.parse(error.message);
            this.validFirebaseError(json.error.message, error.message)
        }

    }

    async register(email: string, password: string): Promise<UserFirebase> {
        try {
            const { user } = await this.afAuth.createUserWithEmailAndPassword(
                email,
                password,
            );

            await this.sendVerificationEmail();
            await this.resetPassword(email);

            this.updateUserData(user);

            return user;
        } catch (error) {
            this.validFirebaseError(error.code, error.message)
        }
    }

    async registerTeacher(email: string, password: string): Promise<UserFirebase> {
        try {
            const { user } = await this.afAuth.createUserWithEmailAndPassword(
                email,
                password,
            );

            await this.sendVerificationEmail();
            await this.resetPassword(email);

            this.updateTeacherData(user);

            return user;
        } catch (error) {
            this.validFirebaseError(error.code, error.message)
        }
    }

    validFirebaseError(code: string, message: string) {

        if (code == 'auth/email-already-in-use')
            Swal.fire('Correo electrónico duplicado', 'La dirección de correo electrónico ya está siendo utilizada por otra cuenta', 'error');
        else if (code == 'auth/wrong-password')
            Swal.fire('Contraseña inválida', 'La contraseña no es válida o el usuario no tiene contraseña.', 'error');
        else if (code == 'auth/too-many-requests')
            Swal.fire('Demasiados intentos', 'Se ha superado el número de intentos permitidos.', 'error');
        else if (code == 'auth/user-not-found')
            Swal.fire('Usuario no encontrado', 'El usuario no se encuentra en registrado.', 'error');
        else if (code == 'auth/network-request-failed')
            Swal.fire('Se ha producido un error de red', 'Conexión interrumpida o host inaccesible.', 'error');
        else if (code == 'INVALID_LOGIN_CREDENTIALS')
            Swal.fire('Credenciales inválidas', 'El correo y/o contraseña no son válidos.', 'error');
        else
            Swal.fire(code, message, 'error');

    }


    async logout(): Promise<void> {
        try {
            await this.afAuth.signOut();
        } catch (error) {

        }
    }

    private updateUserData(user: UserFirebase) {
        const userRef: AngularFirestoreDocument<UserFirebase> = this.afs.doc(
            `users/${user.uid}`
        );

        const data: UserFirebase = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAcademic: true,
        };

        return userRef.set(data, { merge: true });
    }


    private updateTeacherData(user: UserFirebase) {
        const userRef: AngularFirestoreDocument<UserFirebase> = this.afs.doc(
            `users/${user.uid}`
        );

        const data: UserFirebase = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isTeacher: true,
        };

        return userRef.set(data, { merge: true });
    }

    async updateEmail(email: string, password: string, newEmail: string): Promise<UserFirebase> {
        try {
            const { user } = await this.afAuth.signInWithEmailAndPassword(
                email,
                password
            );
            user.updateEmail(newEmail);
            this.updateUserData(user);
            return user;


        } catch (error) {
            this.validFirebaseError(error.code, error.message)
        }
    }


}
