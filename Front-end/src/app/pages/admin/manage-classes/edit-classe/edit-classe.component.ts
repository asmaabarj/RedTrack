import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Class } from '../../../../models/class.model';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectClasses } from '../../../../store/class/class.selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  existingClassError = '';

  constructor(private fb: FormBuilder, private store: Store) {
    this.editClassForm = this.fb.group({
      nom: ['', Validators.required],
      niveau: ['', Validators.required],
      annee: ['', Validators.required]
    });

    this.editClassForm.get('nom')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(nomValue => {
        if (nomValue && nomValue !== this.classe.nom) {
          this.store.select(selectClasses).subscribe(classes => {
            const exists = classes.some(c => 
              c.id !== this.classe.id && 
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

  ngOnInit() {
    this.editClassForm.patchValue({
      nom: this.classe.nom,
      niveau: this.classe.niveau,
      annee: this.classe.annee
    });
  }

  onSubmit(): void {
    if (this.editClassForm.valid && !this.existingClassError) {
      this.store.dispatch(ClassActions.updateClass({
        id: this.classe.id,
        request: this.editClassForm.value
      }));
      this.classUpdated.emit();
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
} 