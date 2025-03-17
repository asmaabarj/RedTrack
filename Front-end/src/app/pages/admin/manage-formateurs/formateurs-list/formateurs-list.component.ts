import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import { Class } from '../../../../models/class.model';
import * as FormateurActions from '../../../../store/formateur/formateur.actions';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectFormateurs, selectFormateursLoading } from '../../../../store/formateur/formateur.selectors';
import { selectClasses } from '../../../../store/class/class.selectors';
import { FilterUsersPipe } from '../../../../pipes/filter-users.pipe';
import { CreateUserComponent } from '../../create-user/create-user.component';
import { UpdateUserComponent } from '../../update-user/update-user.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formateurs-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FilterUsersPipe, CreateUserComponent, UpdateUserComponent],
  templateUrl: './formateurs-list.component.html'
})
export class FormateursListComponent implements OnInit {
  formateurs$: Observable<User[]>;
  classes$: Observable<Class[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  selectedClassId: string = '';
  showCreateModal = false;
  showUpdateModal = false;
  selectedUser: User | null = null;
  showArchived = false;

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  showConfirmModal = false;
  selectedFormateurForAction: User | null = null;
  confirmAction: 'archive' | 'unarchive' = 'archive';

  constructor(private store: Store) {
    this.formateurs$ = this.store.select(selectFormateurs).pipe(
      map(formateurs => this.filterAndPaginateFormateurs(formateurs))
    );
    this.classes$ = this.store.select(selectClasses);
    this.loading$ = this.store.select(selectFormateursLoading);
  }

  ngOnInit(): void {
    this.loadFormateurs();
    this.store.dispatch(ClassActions.loadClasses());
  }

  loadFormateurs(): void {
    if (this.showArchived) {
      this.store.dispatch(FormateurActions.loadArchivedFormateurs());
    } else {
      this.store.dispatch(FormateurActions.loadFormateurs());
    }
  }

  filterAndPaginateFormateurs(formateurs: User[]): User[] {
    let filtered = this.filterFormateurs(formateurs);
    
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.formateurs$ = this.store.select(selectFormateurs).pipe(
        map(formateurs => this.filterAndPaginateFormateurs(formateurs))
      );
    }
  }

  toggleArchived(): void {
    this.showArchived = !this.showArchived;
    this.currentPage = 1; 
    this.loadFormateurs();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1; 
    this.formateurs$ = this.store.select(selectFormateurs).pipe(
      map(formateurs => this.filterAndPaginateFormateurs(formateurs))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.formateurs$ = this.store.select(selectFormateurs).pipe(
      map(formateurs => this.filterAndPaginateFormateurs(formateurs))
    );
  }

  onClassFilter(event: Event): void {
    this.selectedClassId = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.formateurs$ = this.store.select(selectFormateurs).pipe(
      map(formateurs => this.filterAndPaginateFormateurs(formateurs))
    );
  }

  filterFormateurs(formateurs: User[]): User[] {
    let filtered = formateurs;
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(formateur => 
        formateur.nom.toLowerCase().includes(searchLower) ||
        formateur.prenom.toLowerCase().includes(searchLower) ||
        formateur.email.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedClassId) {
      filtered = filtered.filter(formateur => 
        formateur.classes?.some(classe => classe.id === this.selectedClassId)
      );
    }

    return filtered;
  }

  onArchive(formateur: User): void {
    this.selectedFormateurForAction = formateur;
    this.confirmAction = 'archive';
    this.showConfirmModal = true;
  }

  onUnarchive(formateur: User): void {
    this.selectedFormateurForAction = formateur;
    this.confirmAction = 'unarchive';
    this.showConfirmModal = true;
  }

  confirmActionModal(): void {
    if (this.selectedFormateurForAction) {
      if (this.confirmAction === 'archive') {
        this.store.dispatch(FormateurActions.archiveFormateur({ 
          id: this.selectedFormateurForAction.id 
        }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Le formateur a été archivé avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        this.store.dispatch(FormateurActions.unarchiveFormateur({ 
          id: this.selectedFormateurForAction.id 
        }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Le formateur a été désarchivé avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      }

      setTimeout(() => {
        this.currentPage = 1; 
        this.loadFormateurs();
        this.closeConfirmModal();
      }, 300);
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedFormateurForAction = null;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onUserCreated(): void {
    this.loadFormateurs();
  }

  onEdit(formateur: User): void {
    this.selectedUser = formateur;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedUser = null;
    this.loadFormateurs();
  }
}
