import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';
import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error$ = this.store.select(selectAuthError);
  loading$ = this.store.select(selectAuthLoading);

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.error$.pipe(
      filter(error => error !== null)
    ).subscribe(error => {
      if (error?.includes('désactivé')) {
        Swal.fire({
          title: 'Compte désactivé',
          text: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc2626',
          background: '#ffffff',
          iconColor: '#dc2626',
          showCloseButton: true,
          customClass: {
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          }
        });
      } else if (error) {
        this.showErrorMessage(error);
      }
    });
  }

  private showErrorMessage(message: string) {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login({ credentials: this.loginForm.value }));
    }
  }
}
