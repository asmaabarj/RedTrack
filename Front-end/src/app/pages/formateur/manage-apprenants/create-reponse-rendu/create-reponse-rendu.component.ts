import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Rendu } from '../../../../models/rendu.model';
import { Store } from '@ngrx/store';
import * as FormateurRendusActions from '../../../../store/formateur-rendus/formateur-rendus.actions';

@Component({
  selector: 'app-create-reponse-rendu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-reponse-rendu.component.html'
})
export class CreateReponseRenduComponent {
  @Input() rendu!: Rendu;
  @Output() closeModal = new EventEmitter<void>();
  @Output() responseCreated = new EventEmitter<void>();

  responseForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.responseForm = this.fb.group({
      commentaire: ['', [Validators.required, Validators.minLength(10)]],
      type: ['pending', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.responseForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.responseForm.valid) {
      this.store.dispatch(FormateurRendusActions.createRenduResponse({
        renduId: this.rendu.id,
        response: this.responseForm.value
      }));
      this.responseCreated.emit();
      this.closeModal.emit();
    } else {
      Object.keys(this.responseForm.controls).forEach(key => {
        const control = this.responseForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
