import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Class } from '../../../../models/class.model';
import * as ClassActions from '../../../../store/class/class.actions';

@Component({
  selector: 'app-edit-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-classe.component.html'
})
export class EditClasseComponent implements OnInit {
  @Input() classe!: Class;
  @Output() closeModal = new EventEmitter<void>();
  @Output() classUpdated = new EventEmitter<void>();

  editClassForm: FormGroup;
  niveaux = ['1ère année', '2ème année'];

  constructor(private fb: FormBuilder, private store: Store) {
    this.editClassForm = this.fb.group({
      nom: ['', Validators.required],
      niveau: ['', Validators.required],
      annee: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialize form with class data
    this.editClassForm.patchValue({
      nom: this.classe.nom,
      niveau: this.classe.niveau,
      annee: this.classe.annee
    });
  }

  onSubmit(): void {
    if (this.editClassForm.valid) {
      this.store.dispatch(ClassActions.updateClass({
        id: this.classe.id,
        request: this.editClassForm.value
      }));
      this.classUpdated.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
} 