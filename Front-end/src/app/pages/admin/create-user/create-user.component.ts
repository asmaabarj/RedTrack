import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { Class } from '../../../models/class.model';
import * as ClassActions from '../../../store/class/class.actions';
import { selectClasses } from '../../../store/class/class.selectors';
import { Role } from '../../../models/user.model';
import * as FormateurActions from '../../../store/formateur/formateur.actions';
import * as ApprenantActions from '../../../store/apprenant/apprenant.actions';
import { selectFormateurs } from '../../../store/formateur/formateur.selectors';
import { selectApprenants } from '../../../store/apprenant/apprenant.selectors';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {
  @Input() userType: 'FORMATEUR' | 'APPRENANT' = 'FORMATEUR';
  @Output() closeModal = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();

  userForm: FormGroup;
  classes$: Observable<Class[]>;
  submitted = false;
  existingEmailError = '';

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.classes$ = this.store.select(selectClasses);
    this.userForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      classeIds: ['', Validators.required]
    });

    // Check for existing email
    this.userForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(emailValue => {
        if (emailValue) {
          combineLatest([
            this.store.select(selectFormateurs),
            this.store.select(selectApprenants)
          ]).pipe(
            map(([formateurs, apprenants]) => [...formateurs, ...apprenants])
          ).subscribe(users => {
            const exists = users.some(user => 
              user.email.toLowerCase() === emailValue.toLowerCase()
            );
            this.existingEmailError = exists ? 
              'Cet email existe déjà' : '';
          });
        } else {
          this.existingEmailError = '';
        }
      });
  }

  ngOnInit(): void {
    this.store.dispatch(ClassActions.loadClasses());
    if (this.userType === 'FORMATEUR') {
      this.store.dispatch(FormateurActions.loadFormateurs());
    } else {
      this.store.dispatch(ApprenantActions.loadApprenants());
    }
  }

  get f() { 
    return this.userForm.controls; 
  }

  getErrorMessage(fieldName: string): string {
    const control = this.f[fieldName];
    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    switch (fieldName) {
      case 'prenom':
      case 'nom':
        if (control.hasError('minlength')) {
          return 'Minimum 2 caractères requis';
        }
        if (control.hasError('maxlength')) {
          return 'Maximum 50 caractères autorisés';
        }
        break;
      
      case 'email':
        if (control.hasError('email') || control.hasError('pattern')) {
          return 'Email invalide';
        }
        if (this.existingEmailError) {
          return this.existingEmailError;
        }
        break;
      
      case 'password':
        if (control.hasError('minlength')) {
          return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        break;
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.valid && !this.existingEmailError) {
      const formData = {
        ...this.userForm.value,
        role: this.userType === 'FORMATEUR' ? Role.FORMATEUR : Role.APPRENANT,
        classeIds: [this.userForm.value.classeIds]
      };

      if (this.userType === 'FORMATEUR') {
        this.store.dispatch(FormateurActions.createFormateur({ request: formData }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Le formateur a été créé avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        this.store.dispatch(ApprenantActions.createApprenant({ request: formData }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: "L'apprenant a été créé avec succès",
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      this.userCreated.emit();
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
