import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { CreateClasseComponent } from '../create-classe/create-classe.component';
import { Class } from '../../../../models/class.model';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectClasses, selectClassesLoading, selectArchivedClasses } from '../../../../store/class/class.selectors';
import { EditClasseComponent } from '../edit-classe/edit-classe.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FormsModule, 
    CreateClasseComponent,
    EditClasseComponent
  ],
  templateUrl: './classes-list.component.html'
})
export class ClassesListComponent implements OnInit {
  classes$: Observable<Class[]>;
  archivedClasses$: Observable<Class[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  selectedNiveau: string = '';
  showArchived = false;
  showCreateModal = false;
  showEditModal = false;
  selectedClass: Class | null = null;
  pageSize = 6;
  currentPage = 1;
  totalPages = 1;
  showConfirmModal = false;
  confirmAction: 'archive' | 'unarchive' | null = null;
  selectedClassForAction: Class | null = null;
    Math = Math;


  niveaux = ['Toutes les classes', '1ère année', '2ème année'];

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectClassesLoading);
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterAndPaginateClasses(classes))
    );
    this.archivedClasses$ = this.store.select(selectArchivedClasses).pipe(
      map(classes => this.filterAndPaginateClasses(classes))
    );
  }

  ngOnInit() {
    this.selectedNiveau = 'Toutes les classes';
    this.loadClasses();
  }

  loadClasses() {
    if (this.showArchived) {
      this.store.dispatch(ClassActions.loadArchivedClasses());
    } else {
      this.store.dispatch(ClassActions.loadClasses());
    }
  }

  toggleArchivedView(): void {
    this.showArchived = !this.showArchived;
    this.loadClasses();
  }

  private filterAndPaginateClasses(classes: Class[]): Class[] {
    let filteredClasses = classes.filter(classe => {
      const matchesSearch = this.searchTerm ? 
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesNiveau = this.selectedNiveau && this.selectedNiveau !== 'Toutes les classes' ? 
        classe.niveau === this.selectedNiveau : true;
      return matchesSearch && matchesNiveau;
    });

    this.totalPages = Math.ceil(filteredClasses.length / this.pageSize);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredClasses.slice(startIndex, startIndex + this.pageSize);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.updateFilter();
  }

  onNiveauChange(niveau: string): void {
    this.selectedNiveau = niveau === this.selectedNiveau ? 'Toutes les classes' : niveau;
    this.updateFilter();
  }

  private updateFilter(): void {
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterAndPaginateClasses(classes))
    );
    this.archivedClasses$ = this.store.select(selectArchivedClasses).pipe(
      map(classes => this.filterAndPaginateClasses(classes))
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedNiveau = 'Toutes les classes';
    this.updateFilter();
  }

  openCreateClassModal(): void {
    this.showCreateModal = true;
  }

  closeCreateClassModal(): void {
    this.showCreateModal = false;
  }

  onClassCreated(): void {
    this.closeCreateClassModal();
    setTimeout(() => {
      this.loadClasses();
      this.currentPage = 1;
      this.updateFilter();
    }, 300);
  }

  onArchive(classe: Class): void {
    this.selectedClassForAction = classe;
    this.confirmAction = 'archive';
    this.showConfirmModal = true;
  }

  onUnarchive(classe: Class): void {
    this.selectedClassForAction = classe;
    this.confirmAction = 'unarchive';
    this.showConfirmModal = true;
  }

  confirmActionModal(): void {
    if (this.selectedClassForAction && this.confirmAction) {
      if (this.confirmAction === 'archive') {
        this.store.dispatch(ClassActions.archiveClass({ id: this.selectedClassForAction.id }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'La classe a été archivée avec succès',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.loadClasses();
          this.currentPage = 1;
          this.updateFilter();
        }, 300);
      } else {
        this.store.dispatch(ClassActions.unarchiveClass({ id: this.selectedClassForAction.id }));
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'La classe a été désarchivée avec succès',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.loadClasses();
          this.currentPage = 1;
          this.updateFilter();
        }, 300);
      }
      this.closeConfirmModal();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.selectedClassForAction = null;
  }

  onEdit(classe: Class): void {
    this.selectedClass = classe;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedClass = null;
  }

  onClassUpdated(): void {
    this.closeEditModal();
    this.loadClasses();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateFilter();
  }
}
