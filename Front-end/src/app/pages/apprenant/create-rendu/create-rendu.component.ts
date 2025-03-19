import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EtapeAvecRendus, RenduDTO } from '../../../models/rendu.model';
import * as RendusActions from '../../../store/apprenant-rendus/apprenant-rendus.actions';

@Component({
  selector: 'app-create-rendu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-rendu.component.html'
})
export class CreateRenduComponent implements OnInit {
  @Input() etape!: EtapeAvecRendus;
  @Output() closeModal = new EventEmitter<void>();
  @Output() renduCreated = new EventEmitter<void>();

  renduForm: FormGroup;
  urlPattern = '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$';

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.renduForm = this.fb.group({
      livrable: ['', [Validators.required, Validators.pattern(this.urlPattern)]],
      commentaire: ['', [Validators.required, Validators.minLength(10)]],
      etapeId: ['']
    });
  }

  ngOnInit() {
    if (this.etape) {
      this.renduForm.patchValue({ etapeId: this.etape.id });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.renduForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.renduForm.valid) {
      this.store.dispatch(RendusActions.createRendu({ 
        rendu: this.renduForm.value 
      }));
      this.renduCreated.emit();
      this.closeModal.emit();
      this.store.dispatch(RendusActions.loadRendus());
    } else {
      Object.keys(this.renduForm.controls).forEach(key => {
        const control = this.renduForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
