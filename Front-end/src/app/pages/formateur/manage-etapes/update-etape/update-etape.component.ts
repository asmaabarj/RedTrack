import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as FormateurEtapesActions from '../../../../store/formateur-etapes/formateur-etapes.actions';
import { Etape } from '../../../../models/etape.model';

@Component({
  selector: 'app-update-etape',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-etape.component.html',
  styleUrl: './update-etape.component.css'
})
export class UpdateEtapeComponent implements OnInit {
  @Input() etape!: Etape;
  @Output() closeModal = new EventEmitter<void>();
  
  etapeForm: FormGroup;
  today = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private store: Store) {
    this.etapeForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      deadline: ['', [Validators.required, this.futureDateValidator()]]
    });
  }

  ngOnInit() {
    if (this.etape) {
      this.etapeForm.patchValue({
        titre: this.etape.titre,
        description: this.etape.description,
        deadline: new Date(this.etape.deadline).toISOString().split('T')[0]
      });
    }
  }

  futureDateValidator() {
    return (control: any) => {
      if (control.value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(control.value);
        if (inputDate < today) {
          return { futureDate: true };
        }
      }
      return null;
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.etapeForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['futureDate']) {
        return 'La date doit être dans le futur';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.etapeForm.valid) {
      this.store.dispatch(FormateurEtapesActions.updateEtape({ 
        id: this.etape.id, 
        etape: this.etapeForm.value 
      }));
      this.closeModal.emit();
    } else {
      Object.keys(this.etapeForm.controls).forEach(key => {
        const control = this.etapeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
