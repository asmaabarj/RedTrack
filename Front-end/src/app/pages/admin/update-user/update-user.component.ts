import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import * as ApprenantActions from '../../../store/apprenant/apprenant.actions';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html'
})
export class UpdateUserComponent implements OnInit {
  @Input() user!: User;
  @Output() closeModal = new EventEmitter<void>();
  
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.updateForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.updateForm.patchValue({
        prenom: this.user.prenom,
        nom: this.user.nom,
        email: this.user.email
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.store.dispatch(ApprenantActions.updateApprenant({
        id: this.user.id,
        request: this.updateForm.value
      }));
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
