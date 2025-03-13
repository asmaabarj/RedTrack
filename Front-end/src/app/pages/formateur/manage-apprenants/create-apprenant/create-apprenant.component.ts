import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createApprenant } from '../../../../store/formateur-apprenants/formateur-apprenants.actions';

@Component({
  selector: 'app-create-apprenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-apprenant.component.html',
  styleUrl: './create-apprenant.component.css'
})
export class CreateApprenantComponent {
  apprenantForm: FormGroup;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.apprenantForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.apprenantForm.valid) {
      this.store.dispatch(createApprenant({ request: this.apprenantForm.value }));
      this.closeModal.emit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}