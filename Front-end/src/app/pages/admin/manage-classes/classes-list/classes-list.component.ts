import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { CreateClasseComponent } from '../create-classe/create-classe.component';
import { Class } from '../../../../models/class.model';
import * as ClassActions from '../../../../store/class/class.actions';
import { selectClasses, selectClassesLoading } from '../../../../store/class/class.selectors';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FormsModule, 
    CreateClasseComponent
  ],
  templateUrl: './classes-list.component.html'
})
export class ClassesListComponent implements OnInit {
  classes$: Observable<Class[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  selectedNiveau: string = '';
  showCreateModal = false;

  niveaux = ['1ère année', '2ème année'];

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectClassesLoading);
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterClasses(classes))
    );
  }

  ngOnInit() {
    this.store.dispatch(ClassActions.loadClasses());
  }

  private filterClasses(classes: Class[]): Class[] {
    return classes.filter(classe => {
      const matchesSearch = classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesNiveau = !this.selectedNiveau || classe.niveau === this.selectedNiveau;
      return matchesSearch && matchesNiveau;
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.updateFilter();
  }

  onNiveauChange(niveau: string): void {
    this.selectedNiveau = niveau;
    this.updateFilter();
  }

  private updateFilter(): void {
    this.classes$ = this.store.select(selectClasses).pipe(
      map(classes => this.filterClasses(classes))
    );
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
}
