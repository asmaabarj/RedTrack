import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Class } from '../../../models/class.model';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import * as ApprenantActions from '../../../store/apprenant/apprenant.actions';
import * as FormateurActions from '../../../store/formateur/formateur.actions';
import * as ClassActions from '../../../store/class/class.actions';
import { selectClasses } from '../../../store/class/class.selectors';
import { selectFormateurs } from '../../../store/formateur/formateur.selectors';
import { selectApprenants } from '../../../store/apprenant/apprenant.selectors';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html'
})
export class UpdateUserComponent implements OnInit {
  @Input() user!: User;
  @Input() userType: 'FORMATEUR' | 'APPRENANT' = 'APPRENANT';
  @Output() closeModal = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();
  
  updateForm: FormGroup;
  classes$: Observable<Class[]>;
  showPassword = false;
  existingEmailError = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.classes$ = this.store.select(selectClasses);
    this.updateForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      classeId: ['', Validators.required],
      password: ['']
    });

    // Check for existing email
    this.updateForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(emailValue => {
        if (emailValue && emailValue !== this.user.email) {
          combineLatest([
            this.store.select(selectFormateurs),
            this.store.select(selectApprenants)
          ]).pipe(
            map(([formateurs, apprenants]) => [...formateurs, ...apprenants])
          ).subscribe(users => {
            const exists = users.some(u => 
              u.email.toLowerCase() === emailValue.toLowerCase() && u.id !== this.user.id
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
    
    if (this.user) {
      this.updateForm.patchValue({
        prenom: this.user.prenom,
        nom: this.user.nom,
        email: this.user.email,
        classeId: this.user.classes?.[0]?.id || ''
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.updateForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }

    switch (fieldName) {
      case 'email':
        if (control.hasError('email')) {
          return 'Email invalide';
        }
        if (this.existingEmailError) {
          return this.existingEmailError;
        }
        break;
    }
    return '';
  }

  onSubmit(): void {
    if (this.updateForm.valid && !this.existingEmailError) {
      const { classeId, password, ...userData } = this.updateForm.value;
      const request = password ? { ...userData, password } : userData;
      
      if (this.userType === 'FORMATEUR') {
        this.store.dispatch(FormateurActions.updateFormateur({
          id: this.user.id,
          request,
          newClassId: classeId
        }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Le formateur a été modifié avec succès',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.userUpdated.emit();
          this.closeModal.emit();
          window.location.reload();
        });
      } else {
        this.store.dispatch(ApprenantActions.updateApprenant({
          id: this.user.id,
          request,
          newClassId: classeId
        }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: "L'apprenant a été modifié avec succès",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.userUpdated.emit();
          this.closeModal.emit();
          window.location.reload();
        });
      }
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
