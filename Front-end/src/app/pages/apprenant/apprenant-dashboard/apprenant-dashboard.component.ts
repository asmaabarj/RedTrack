import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Class } from '../../../models/class.model';
import { Etape } from '../../../models/etape.model';
import * as ApprenantClassesActions from '../../../store/apprenant-classes/apprenant-classes.action';
import * as ApprenantEtapesActions from '../../../store/apprenant-etapes/apprenant-etapes.actions';
import { 
  selectApprenantClasses, 
  selectApprenantClassesLoading,
  selectApprenantClassesError 
} from '../../../store/apprenant-classes/apprenant-classes.selectors';
import {
  selectEtapes,
  selectEtapesLoading
} from '../../../store/apprenant-etapes/apprenant-etapes.selectors';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './apprenant-dashboard.component.html'
})
export class ApprenantDashboardComponent implements OnInit {
  classes$: Observable<Class[]>;
  etapes$: Observable<Etape[]>;
  loading$: Observable<boolean>;
  etapesLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  showUpdateModal = false;
  selectedClasse: Class | null = null;
  selectedEtape: Etape | null = null;
  showEtapeModal = false;

  constructor(private store: Store) {
    this.classes$ = this.store.select(selectApprenantClasses);
    this.etapes$ = this.store.select(selectEtapes);
    this.loading$ = this.store.select(selectApprenantClassesLoading);
    this.etapesLoading$ = this.store.select(selectEtapesLoading);
    this.error$ = this.store.select(selectApprenantClassesError);

    // Debug subscriptions
    this.classes$.subscribe(classes => {
      console.log('Classes in component:', classes);
    });
    
    this.error$.subscribe(error => {
      if (error) console.error('Error in component:', error);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(ApprenantClassesActions.loadApprenantClasses());
    this.store.dispatch(ApprenantEtapesActions.loadEtapes());
  }

  onEdit(classe: Class): void {
    this.selectedClasse = classe;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedClasse = null;
  }

  truncateDescription(description: string): string {
    return description.length > 255 ? description.substring(0, 255) + '...' : description;
  }

  shouldShowMore(description: string): boolean {
    return description.length > 255;
  }

  showEtapeDetails(etape: Etape): void {
    this.selectedEtape = etape;
    this.showEtapeModal = true;
  }

  closeEtapeModal(): void {
    this.showEtapeModal = false;
    this.selectedEtape = null;
  }
}
