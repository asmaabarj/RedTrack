import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Class } from '../../../models/class.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ApprenantActions from '../../../store/apprenant/apprenant.actions';
import * as FormateurActions from '../../../store/formateur/formateur.actions';
import * as ClassActions from '../../../store/class/class.actions';
import { selectClasses } from '../../../store/class/class.selectors';
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
  }

  ngOnInit(): void {
    this.store.dispatch(ClassActions.loadClasses());
    
    if (this.user) {
      this.updateForm.patchValue({
        prenom: this.user.prenom,
        nom: this.user.nom,
        email: this.user.email,
        classeId: this.user.classes?.[0]?.id || ''
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
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
