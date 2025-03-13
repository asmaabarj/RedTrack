import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    this.etapes$ = this.store.select(selectRendus);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(RendusActions.loadRendus());
  }

  getStatusClass(type: string): string {
    switch (type) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
