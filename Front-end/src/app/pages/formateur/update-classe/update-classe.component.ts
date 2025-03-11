import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Class } from '../../../models/class.model';
import * as FormateurClassesActions from '../../../store/formateur-classes/formateur-classes.actions';

@Component({
  selector: 'app-update-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-classe.component.html',
  styleUrl: './update-classe.component.css'
})
export class UpdateClasseComponent {
  @Input() classe!: Class;
  @Output() closeModal = new EventEmitter<void>();
  
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      niveau: ['', Validators.required],
      annee: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form.patchValue({
      nom: this.classe.nom,
      niveau: this.classe.niveau,
      annee: this.classe.annee
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.store.dispatch(FormateurClassesActions.updateClass({
        id: this.classe.id,
        class: this.form.value
      }));
      this.closeModal.emit();
    }
  }
}
