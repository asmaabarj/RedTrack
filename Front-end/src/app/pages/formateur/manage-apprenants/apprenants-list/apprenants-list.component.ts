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
import Swal from 'sweetalert2';

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
  
  // Add pagination properties
  pageSize = 6;
  currentPage = 1;
  totalPages = 1;

  showConfirmModal = false;
  confirmAction: 'archive' | 'unarchive' = 'archive';
  selectedApprenantForAction: User | null = null;

  constructor(private store: Store) {
    this.apprenants$ = this.store.select(selectApprenants);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    
    this.filteredApprenants$ = this.apprenants$.pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment archiver cet apprenant ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(archiveApprenant({ apprenantId }));
        
        setTimeout(() => {
          if (this.showArchived) {
            this.store.dispatch(loadArchivedApprenants());
          } else {
            this.store.dispatch(loadApprenants());
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: "L'apprenant a été archivé avec succès",
            timer: 2000,
            showConfirmButton: false
          });
        }, 300);
      }
    });
  }

  unarchiveApprenant(apprenantId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment désarchiver cet apprenant ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, désarchiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(unarchiveApprenant({ apprenantId }));
        
        setTimeout(() => {
          if (this.showArchived) {
            this.store.dispatch(loadArchivedApprenants());
          } else {
            this.store.dispatch(loadApprenants());
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: "L'apprenant a été désarchivé avec succès",
            timer: 2000,
            showConfirmButton: false
          });
        }, 300);
      }
    });
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filteredApprenants$ = this.apprenants$.pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1; // Reset to first page when searching
    this.filteredApprenants$ = this.apprenants$.pipe(
      map(apprenants => this.filterAndPaginateApprenants(apprenants))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1; // Reset to first page when clearing search
    this.filteredApprenants$ = this.apprenants$;
  }

  private filterApprenants(apprenants: User[]): User[] {
    if (!this.searchTerm) return apprenants;
    
    const term = this.searchTerm.toLowerCase();
    return apprenants.filter(apprenant => 
      apprenant.nom.toLowerCase().includes(term) || 
      apprenant.prenom.toLowerCase().includes(term) ||
      apprenant.email.toLowerCase().includes(term)
    );
  }

  private filterAndPaginateApprenants(apprenants: User[]): User[] {
    const filtered = this.filterApprenants(apprenants);
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }
}
