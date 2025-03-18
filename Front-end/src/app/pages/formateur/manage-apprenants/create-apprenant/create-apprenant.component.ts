import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createApprenant } from '../../../../store/formateur-apprenants/formateur-apprenants.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-apprenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-apprenant.component.html',
  styleUrl: './create-apprenant.component.css'
})
export class CreateApprenantComponent {
  apprenantForm: FormGroup;
  submitted = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.apprenantForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  get f() { 
    return this.apprenantForm.controls; 
  }

  getErrorMessage(fieldName: string): string {
    const control = this.f[fieldName];
    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    switch (fieldName) {
      case 'prenom':
      case 'nom':
        if (control.hasError('minlength')) {
          return 'Minimum 2 caractères requis';
        }
        if (control.hasError('maxlength')) {
          return 'Maximum 50 caractères autorisés';
        }
        break;
      
      case 'email':
        if (control.hasError('email') || control.hasError('pattern')) {
          return 'Email invalide';
        }
        break;
      
      case 'password':
        if (control.hasError('minlength')) {
          return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        break;
    }
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.apprenantForm.valid) {
      this.store.dispatch(createApprenant({ request: this.apprenantForm.value }));
      
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: "L'apprenant a été créé avec succès",
        timer: 2000,
        showConfirmButton: false
      });
      
      this.closeModal.emit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}