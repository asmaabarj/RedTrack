import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from '../../../../models/user.model';
import { updateApprenant } from '../../../../store/formateur-apprenants/formateur-apprenants.actions';

@Component({
  selector: 'app-update-apprenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-apprenant.component.html',
})
export class UpdateApprenantComponent implements OnInit {
  @Input() apprenant!: User;
  @Output() closeModal = new EventEmitter<void>();
  
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required]
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

  onSubmit() {
    if (this.updateForm.valid) {
      this.store.dispatch(updateApprenant({ 
        apprenantId: this.apprenant.id, 
        request: this.updateForm.value 
      }));
      this.closeModal.emit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
