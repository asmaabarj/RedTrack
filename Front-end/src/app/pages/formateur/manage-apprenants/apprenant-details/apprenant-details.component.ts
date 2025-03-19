import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { EtapeAvecRendus, Rendu } from '../../../../models/rendu.model';
import * as FormateurRendusActions from '../../../../store/formateur-rendus/formateur-rendus.actions';
import { selectEtapes, selectLoading, selectError } from '../../../../store/formateur-rendus/formateur-rendus.selectors';
import { CreateReponseRenduComponent } from '../create-reponse-rendu/create-reponse-rendu.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-apprenant-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CreateReponseRenduComponent],
  templateUrl: './apprenant-details.component.html'
})
export class ApprenantDetailsComponent implements OnInit {
  etapes$: Observable<EtapeAvecRendus[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showResponseModal = false;
  selectedRendu: Rendu | null = null;
  selectedEtape: EtapeAvecRendus | null = null;
  apprenantId: string;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.etapes$ = this.store.select(selectEtapes).pipe(
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
    
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/formateur/apprenants']);
      throw new Error('Apprenant ID not found');
    }
    this.apprenantId = id;
  }

  ngOnInit(): void {
    this.store.dispatch(FormateurRendusActions.loadApprenantRendus({ apprenantId: this.apprenantId }));
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getStatusLabel(type: string): string {
    switch (type) {
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

  selectEtape(etape: EtapeAvecRendus): void {
    this.selectedEtape = etape;
    localStorage.setItem('selectedEtapeId', etape.id.toString());
  }

  onSubmitResponse(rendu: Rendu): void {
    this.selectedRendu = rendu;
    this.showResponseModal = true;
  }

  onRenduResponseCreated(): void {
    this.store.dispatch(FormateurRendusActions.loadApprenantRendus({ apprenantId: this.apprenantId }));
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
    this.showResponseModal = false;
    this.selectedRendu = null;
    this.onRenduResponseCreated();
  }

  getLastRendu(rendus: any[]): any {
    return rendus[rendus.length - 1];
  }
}
