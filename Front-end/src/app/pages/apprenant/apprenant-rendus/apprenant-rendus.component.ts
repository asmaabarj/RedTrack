import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { EtapeAvecRendus } from '../../../models/rendu.model';
import * as RendusActions from '../../../store/apprenant-rendus/apprenant-rendus.actions';
import { selectRendus, selectLoading, selectError } from '../../../store/apprenant-rendus/apprenant-rendus.selectors';
import { CreateRenduComponent } from '../create-rendu/create-rendu.component';

@Component({
  selector: 'app-apprenant-rendus',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CreateRenduComponent],
  templateUrl: './apprenant-rendus.component.html'
})
export class ApprenantRendusComponent implements OnInit {
  etapes$: Observable<EtapeAvecRendus[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showCreateModal = false;
  selectedEtape: EtapeAvecRendus | null = null;

  constructor(private store: Store) {
    this.etapes$ = this.store.select(selectRendus).pipe(
      tap(etapes => {
        if (etapes.length > 0 && !this.selectedEtape) {
          this.selectedEtape = etapes[0];
        }
      })
    );
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(RendusActions.loadRendus());
  }

  selectEtape(etape: EtapeAvecRendus): void {
    this.selectedEtape = etape;
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getStatusClass(type: string): string {
    switch (type) {
      case 'accepted': 
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'rejected': 
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
      default: 
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    }
  }

  onSubmitRendu(etape: EtapeAvecRendus): void {
    this.selectedEtape = etape;
    this.showCreateModal = true;
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.selectedEtape = null;
  }
}
