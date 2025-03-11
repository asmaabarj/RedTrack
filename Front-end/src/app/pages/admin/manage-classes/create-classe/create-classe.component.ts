import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ClassActions from '../../../../store/class/class.actions';

@Component({
  selector: 'app-create-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-classe.component.html',
  styleUrl: './create-classe.component.css'
})
export class CreateClasseComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() classCreated = new EventEmitter<void>();

  createClassForm: FormGroup;
  niveaux = ['1ère année', '2ème année'];

  constructor(private fb: FormBuilder, private store: Store) {
    this.createClassForm = this.fb.group({
      nom: ['', Validators.required],
      niveau: ['', Validators.required],
      annee: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createClassForm.valid) {
      this.store.dispatch(ClassActions.createClass({ 
        request: this.createClassForm.value 
      }));
      this.classCreated.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
