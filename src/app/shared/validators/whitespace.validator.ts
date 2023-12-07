import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export function whitespaceValidator(control: AbstractControl): ValidationErrors | null {
  return (control.value || '').trim().length? null : { whitespace: true };
}
