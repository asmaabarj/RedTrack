import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, tap, filter } from 'rxjs';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { EtapeAvecRendus } from '../../../models/rendu.model';
import * as RendusActions from '../../../store/apprenant-rendus/apprenant-rendus.actions';
import { selectRendus, selectLoading, selectError } from '../../../store/apprenant-rendus/apprenant-rendus.selectors';
import { CreateRenduComponent } from '../create-rendu/create-rendu.component';

@Component({
  selector: 'app-apprenant-rendus',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CreateRenduComponent],
  templateUrl: './apprenant-rendus.component.html',
  styleUrls: ['./apprenant-rendus.component.css']
})
export class ApprenantRendusComponent implements OnInit {
  etapes$: Observable<EtapeAvecRendus[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showCreateModal = false;
  selectedEtape: EtapeAvecRendus | null = null;
  previousSelectedEtape: EtapeAvecRendus | null = null;
  isSidebarOpen = true;

  constructor(private store: Store) {
    this.etapes$ = this.store.select(selectRendus).pipe(
      filter(etapes => etapes.length > 0),
      tap(etapes => {
        if (!this.selectedEtape) {
          this.selectedEtape = etapes[0];
          localStorage.setItem('selectedEtapeId', etapes[0].id.toString());
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
    localStorage.setItem('selectedEtapeId', etape.id.toString());
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Refusé';
      case 'pending':
        return 'En attente';
      default:
        return 'Non évalué';
    }
  }

  getStatusClass(type: string): string {
    switch (type) {
      case 'accepted': 
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'rejected': 
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      default: 
        return 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20';
    }
  }

  isLastRendu(rendu: any, rendus: any[] | undefined): boolean {
    if (!rendus) return false;
    return rendus[rendus.length - 1] === rendu;
  }

  onSubmitRendu(etape: EtapeAvecRendus): void {
    this.previousSelectedEtape = this.selectedEtape;
    this.selectedEtape = etape;
    this.showCreateModal = true;
  }

  onRenduCreated(): void {
    this.store.dispatch(RendusActions.loadRendus());
    this.etapes$.pipe(
      filter(etapes => etapes.length > 0),
      tap(etapes => {
        const currentEtapeId = this.selectedEtape?.id;
        if (currentEtapeId) {
          const updatedEtape = etapes.find(e => e.id === currentEtapeId);
          if (updatedEtape) {
            this.selectedEtape = updatedEtape;
          }
        }
      })
    ).subscribe();
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    if (this.previousSelectedEtape) {
      this.selectedEtape = this.previousSelectedEtape;
      this.previousSelectedEtape = null;
    }
    this.onRenduCreated();
  }

  getLastRendu(rendus: any[]): any {
    return rendus[rendus.length - 1];
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
