import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectClasses } from '../../../../store/class/class.selectors';
import { Class } from '../../../../models/class.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
  existingClassError = '';

  constructor(private fb: FormBuilder, private store: Store) {
    this.createClassForm = this.fb.group({
      nom: ['', Validators.required],
      niveau: ['', Validators.required],
      annee: ['', Validators.required]
    });

    this.createClassForm.get('nom')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(nomValue => {
        if (nomValue) {
          this.store.select(selectClasses).subscribe(classes => {
            const exists = classes.some(c => 
              c.nom.toLowerCase() === nomValue.toLowerCase()
            );
            this.existingClassError = exists ? 
              'Une classe avec ce nom existe déjà' : '';
          });
        } else {
          this.existingClassError = '';
        }
      });
  }

  onSubmit(): void {
    if (this.createClassForm.valid && !this.existingClassError) {
      this.store.dispatch(ClassActions.createClass({ 
        request: this.createClassForm.value 
      }));
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'La classe a été créée avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      this.classCreated.emit();
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
