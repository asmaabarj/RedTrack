import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from '../../../../models/user.model';
import { updateApprenant } from '../../../../store/formateur-apprenants/formateur-apprenants.actions';
import { selectApprenants } from '../../../../store/formateur-apprenants/formateur-apprenants.selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-apprenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-apprenant.component.html'
})
export class UpdateApprenantComponent implements OnInit {
  @Input() apprenant!: User;
  @Output() closeModal = new EventEmitter<void>();
  
  updateForm: FormGroup;
  showPassword = false;
  existingEmailError = '';

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      password: ['']
    });

    // Check for existing email
    this.updateForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(emailValue => {
        if (emailValue && emailValue !== this.apprenant.email) {
          this.store.select(selectApprenants).subscribe(apprenants => {
            const exists = apprenants.some(a => 
              a.email.toLowerCase() === emailValue.toLowerCase() && a.id !== this.apprenant.id
            );
            this.existingEmailError = exists ? 'Cet email existe déjà' : '';
          });
        } else {
          this.existingEmailError = '';
        }
      });
  }

  ngOnInit() {
    if (this.apprenant) {
      this.updateForm.patchValue({
        email: this.apprenant.email,
        nom: this.apprenant.nom,
        prenom: this.apprenant.prenom
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.updateForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }

    switch (fieldName) {
      case 'email':
        if (control.hasError('email')) {
          return 'Email invalide';
        }
        if (this.existingEmailError) {
          return this.existingEmailError;
        }
        break;
      case 'nom':
      case 'prenom':
        if (control.hasError('minlength')) {
          return 'Minimum 2 caractères requis';
        }
        break;
    }
    return '';
  }

  onSubmit() {
    if (this.updateForm.valid && !this.existingEmailError) {
      const { password, ...userData } = this.updateForm.value;
      const request = password ? { ...userData, password } : userData;
      
      this.store.dispatch(updateApprenant({ 
        apprenantId: this.apprenant.id, 
        request 
      }));

      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: "L'apprenant a été modifié avec succès",
        timer: 2000,
        showConfirmButton: false
      });

      this.closeModal.emit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
