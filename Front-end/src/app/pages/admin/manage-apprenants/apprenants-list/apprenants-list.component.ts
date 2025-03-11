import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import * as ApprenantActions from '../../../../store/apprenant/apprenant.actions';
import { selectApprenants, selectApprenantsLoading } from '../../../../store/apprenant/apprenant.selectors';
import { FilterUsersPipe } from '../../../../pipes/filter-users.pipe';
import { CreateUserComponent } from '../../create-user/create-user.component';

@Component({
  selector: 'app-apprenants-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FilterUsersPipe, CreateUserComponent],
  templateUrl: './apprenants-list.component.html'
})
export class ApprenantsListComponent implements OnInit {
  apprenants$: Observable<User[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  showCreateModal = false;

  constructor(private store: Store) {
    this.apprenants$ = this.store.select(selectApprenants);
    this.loading$ = this.store.select(selectApprenantsLoading);
  }

  ngOnInit(): void {
    this.loadApprenants();
  }

  loadApprenants(): void {
    this.store.dispatch(ApprenantActions.loadApprenants());
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  filterApprenants(apprenants: User[]): User[] {
    if (!this.searchTerm) return apprenants;
    
    const searchLower = this.searchTerm.toLowerCase();
    return apprenants.filter(apprenant => 
      apprenant.nom.toLowerCase().includes(searchLower) ||
      apprenant.prenom.toLowerCase().includes(searchLower)
    );
  }

  onArchive(apprenant: User): void {
    if (confirm(`Êtes-vous sûr de vouloir archiver ${apprenant.prenom} ${apprenant.nom} ?`)) {
      this.store.dispatch(ApprenantActions.archiveApprenant({ id: apprenant.id }));
    }
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onUserCreated(): void {
    this.loadApprenants();
  }
}
