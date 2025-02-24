import { FormGroup, AbstractControl } from "@angular/forms";

// To validate password and confirm password
export function ComparePassword(
    controlName: string,
    minimumSalePrice: number
) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        // if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        //     return;
        // }

        if (control.value < minimumSalePrice) {
            control.setErrors({ mustMatch: true });
        } else {
            control.setErrors(null);
        }
    };
}