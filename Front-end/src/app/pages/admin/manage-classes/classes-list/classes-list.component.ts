import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { CreateClasseComponent } from '../create-classe/create-classe.component';
import { Class } from '../../../../models/class.model';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectClasses, selectClassesLoading, selectArchivedClasses } from '../../../../store/class/class.selectors';
import { EditClasseComponent } from '../edit-classe/edit-classe.component';

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

  niveaux = ['Toutes les classes', '1ère année', '2ème année'];

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectClassesLoading);
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterClasses(classes))
    );
    this.archivedClasses$ = this.store.select(selectArchivedClasses).pipe(
      map(classes => this.filterClasses(classes))
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

  private filterClasses(classes: Class[]): Class[] {
    return classes.filter(classe => {
      const matchesSearch = this.searchTerm ? 
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesNiveau = this.selectedNiveau && this.selectedNiveau !== 'Toutes les classes' ? 
        classe.niveau === this.selectedNiveau : true;
      return matchesSearch && matchesNiveau;
    });
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
    // Force update of both observables
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterClasses(classes))
    );
    this.archivedClasses$ = this.store.select(selectArchivedClasses).pipe(
      map(classes => this.filterClasses(classes))
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
    this.store.dispatch(ClassActions.loadClasses());
  }

  onArchive(classe: Class): void {
    if (confirm(`Êtes-vous sûr de vouloir archiver la classe ${classe.nom}?`)) {
      this.store.dispatch(ClassActions.archiveClass({ id: classe.id }));
    }
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
    this.store.dispatch(ClassActions.loadClasses());
  }

  onUnarchive(classe: Class): void {
    if (confirm(`Êtes-vous sûr de vouloir désarchiver la classe ${classe.nom}?`)) {
      this.store.dispatch(ClassActions.unarchiveClass({ id: classe.id }));
    }
  }
}
