import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { loadApprenants, loadArchivedApprenants, archiveApprenant, unarchiveApprenant } from '../../../../store/formateur-apprenants/formateur-apprenants.actions';
import { selectApprenants, selectLoading, selectError } from '../../../../store/formateur-apprenants/formateur-apprenants.selectors';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { CreateApprenantComponent } from '../create-apprenant/create-apprenant.component';
import { UpdateApprenantComponent } from '../update-apprenant/update-apprenant.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-apprenants-list',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    CreateApprenantComponent, 
    UpdateApprenantComponent, 
    FormsModule,
    RouterModule
  ],
  templateUrl: './apprenants-list.component.html',
})
export class ApprenantsListComponent implements OnInit {
  apprenants$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showArchived = false;
  showCreateModal = false;
  showUpdateModal = false;
  selectedApprenant: User | null = null;
  searchTerm: string = '';
  filteredApprenants$: Observable<User[]>;

  constructor(private store: Store) {
    this.apprenants$ = this.store.select(selectApprenants);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    
    this.filteredApprenants$ = this.apprenants$.pipe(
      map(apprenants => this.filterApprenants(apprenants))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadApprenants()); 
  }

  toggleCreateModal(): void {
    this.showCreateModal = !this.showCreateModal;
  }

  toggleArchived(): void {
    this.showArchived = !this.showArchived;
    if (this.showArchived) {
      this.store.dispatch(loadArchivedApprenants()); 
    } else {
      this.store.dispatch(loadApprenants()); 
    }
  }

  archiveApprenant(apprenantId: string): void {
    this.store.dispatch(archiveApprenant({ apprenantId })); 
  }

  unarchiveApprenant(apprenantId: string): void {
    this.store.dispatch(unarchiveApprenant({ apprenantId }));
  }

  toggleUpdateModal(apprenant?: User): void {
    if (apprenant) {
      this.selectedApprenant = apprenant;
      this.showUpdateModal = true;
    } else {
      this.selectedApprenant = null;
      this.showUpdateModal = false;
    }
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredApprenants$ = this.apprenants$.pipe(
      map(apprenants => this.filterApprenants(apprenants))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredApprenants$ = this.apprenants$;
  }

  private filterApprenants(apprenants: User[]): User[] {
    if (!this.searchTerm) return apprenants;
    
    const term = this.searchTerm.toLowerCase();
    return apprenants.filter(apprenant => 
      apprenant.nom.toLowerCase().includes(term) || 
      apprenant.prenom.toLowerCase().includes(term)
    );
  }
}
