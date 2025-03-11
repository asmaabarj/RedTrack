import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Class } from '../../../models/class.model';
import * as ClassActions from '../../../store/class/class.actions';
import { selectClasses } from '../../../store/class/class.selectors';
import { Role } from '../../../models/user.model';
import * as FormateurActions from '../../../store/formateur/formateur.actions';
import * as ApprenantActions from '../../../store/apprenant/apprenant.actions';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  @Input() userType: 'FORMATEUR' | 'APPRENANT' = 'FORMATEUR';
  @Output() closeModal = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();

  userForm: FormGroup;
  classes$: Observable<Class[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.classes$ = this.store.select(selectClasses);
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      classeIds: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(ClassActions.loadClasses());
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = {
        ...this.userForm.value,
        role: this.userType === 'FORMATEUR' ? Role.FORMATEUR : Role.APPRENANT,
        classeIds: [this.userForm.value.classeIds]
      };

      if (this.userType === 'FORMATEUR') {
        this.store.dispatch(FormateurActions.createFormateur({ request: formData }));
      } else {
        this.store.dispatch(ApprenantActions.createApprenant({ request: formData }));
      }
      
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
