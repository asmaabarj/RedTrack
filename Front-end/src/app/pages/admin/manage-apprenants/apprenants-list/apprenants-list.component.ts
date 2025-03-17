import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import { Class } from '../../../../models/class.model';
import * as ApprenantActions from '../../../../store/apprenant/apprenant.actions';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectApprenants, selectApprenantsLoading } from '../../../../store/apprenant/apprenant.selectors';
import { selectClasses } from '../../../../store/class/class.selectors';
import { FilterUsersPipe } from '../../../../pipes/filter-users.pipe';
import { CreateUserComponent } from '../../create-user/create-user.component';
import { UpdateUserComponent } from '../../update-user/update-user.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apprenants-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FilterUsersPipe, CreateUserComponent, UpdateUserComponent],
  templateUrl: './apprenants-list.component.html'
})
export class ApprenantsListComponent implements OnInit {
  apprenants$: Observable<User[]>;
  classes$: Observable<Class[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  selectedClassId: string = '';
  showCreateModal = false;
  showUpdateModal = false;
  selectedUser: User | null = null;
  showArchived = false;
  pageSize = 6;
  currentPage = 1;
  totalPages = 1;
  showConfirmModal = false;
  confirmAction: 'archive' | 'unarchive' = 'archive';
  selectedApprenantForAction: User | null = null;

  constructor(private store: Store) {
    this.apprenants$ = this.store.select(selectApprenants).pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
    this.classes$ = this.store.select(selectClasses);
    this.loading$ = this.store.select(selectApprenantsLoading);
  }

  ngOnInit(): void {
    this.loadApprenants();
    this.store.dispatch(ClassActions.loadClasses());
  }

  loadApprenants(): void {
    if (this.showArchived) {
      this.store.dispatch(ApprenantActions.loadArchivedApprenants());
    } else {
      this.store.dispatch(ApprenantActions.loadApprenants());
    }
  }

  getFilteredApprenants(apprenants: User[]): User[] {
    if (!apprenants) return [];
    
    let filtered = apprenants;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(apprenant => 
        apprenant.nom.toLowerCase().includes(searchLower) ||
        apprenant.prenom.toLowerCase().includes(searchLower) ||
        apprenant.email.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedClassId) {
      filtered = filtered.filter(apprenant => 
        apprenant.classes?.some(classe => classe.id === this.selectedClassId)
      );
    }

    return filtered;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.apprenants$ = this.store.select(selectApprenants).pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.apprenants$ = this.store.select(selectApprenants).pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  onClassFilter(event: Event): void {
    this.selectedClassId = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.apprenants$ = this.store.select(selectApprenants).pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  filterApprenants(apprenants: User[]): User[] {
    let filtered = apprenants;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(apprenant => 
        apprenant.nom.toLowerCase().includes(searchLower) ||
        apprenant.prenom.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedClassId) {
      filtered = filtered.filter(apprenant => 
        apprenant.classes?.some(classe => classe.id === this.selectedClassId)
      );
    }

    return filtered;
  }

  filterAndPaginateApprenants(apprenants: User[]): User[] {
    let filtered = this.filterApprenants(apprenants);
    
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.apprenants$ = this.store.select(selectApprenants).pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  onArchive(apprenant: User): void {
    this.selectedApprenantForAction = apprenant;
    this.confirmAction = 'archive';
    this.showConfirmModal = true;
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

  onEdit(apprenant: User): void {
    this.selectedUser = apprenant;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedUser = null;
  }

  toggleArchived(): void {
    this.showArchived = !this.showArchived;
    this.loadApprenants();
  }

  onUnarchive(apprenant: User): void {
    this.selectedApprenantForAction = apprenant;
    this.confirmAction = 'unarchive';
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedApprenantForAction = null;
  }

  confirmActionModal(): void {
    if (this.selectedApprenantForAction) {
      if (this.confirmAction === 'archive') {
        this.store.dispatch(ApprenantActions.archiveApprenant({ 
          id: this.selectedApprenantForAction.id 
        }));
      } else {
        this.store.dispatch(ApprenantActions.unarchiveApprenant({ 
          id: this.selectedApprenantForAction.id 
        }));
      }
      
      setTimeout(() => {
        this.loadApprenants();
        this.currentPage = 1;
        this.apprenants$ = this.store.select(selectApprenants).pipe(
          map(apprenants => this.filterAndPaginateApprenants(apprenants))
        );
      }, 300);
    }
    this.closeConfirmModal();
  }
}
