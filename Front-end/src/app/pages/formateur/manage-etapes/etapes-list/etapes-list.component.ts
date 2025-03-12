import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Etape } from '../../../../models/etape.model';
import * as FormateurEtapesActions from '../../../../store/formateur-etapes/formateur-etapes.actions';
import { selectEtapes, selectEtapesLoading } from '../../../../store/formateur-etapes/formateur-etapes.selectors';
import { EtapeDetailsComponent } from '../etape-details/etape-details.component';
import { CreateEtapeComponent } from '../create-etape/create-etape.component';
import { UpdateEtapeComponent } from '../update-etape/update-etape.component';

@Component({
  selector: 'app-etapes-list',
  standalone: true,
  imports: [
    CommonModule, 
    EtapeDetailsComponent, 
    CreateEtapeComponent,
    UpdateEtapeComponent
  ],
  templateUrl: './etapes-list.component.html'
})
export class EtapesListComponent implements OnInit {
  etapes$: Observable<Etape[]>;
  loading$: Observable<boolean>;
  currentIndex = 0;
  selectedEtape: Etape | null = null;
  showDetailsModal = false;
  showCreateModal = false;
  showUpdateModal = false;

  constructor(private store: Store) {
    this.etapes$ = this.store.select(selectEtapes);
    this.loading$ = this.store.select(selectEtapesLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(FormateurEtapesActions.loadEtapes());
  }

  nextEtapes(): void {
    this.currentIndex++;
  }

  previousEtapes(): void {
    this.currentIndex--;
  }

  hasMoreEtapes(etapes: Etape[]): boolean {
    return this.currentIndex < Math.ceil(etapes.length / 3) - 1;
  }

  onEdit(etape: Etape): void {
    this.selectedEtape = etape;
    this.showUpdateModal = true;
  }

  onDetails(etape: Etape): void {
    this.selectedEtape = etape;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEtape = null;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedEtape = null;
  }
}
