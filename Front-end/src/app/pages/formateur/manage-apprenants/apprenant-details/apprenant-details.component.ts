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
    this.etapes$ = this.store.select(selectEtapes);
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

  selectEtape(etape: EtapeAvecRendus): void {
    this.selectedEtape = etape;
  }

  onSubmitResponse(rendu: Rendu): void {
    this.selectedRendu = rendu;
    this.showResponseModal = true;
  }

  onCloseModal(): void {
    this.showResponseModal = false;
    this.selectedRendu = null;
  }
}
