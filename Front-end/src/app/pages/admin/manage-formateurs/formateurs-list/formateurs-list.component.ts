import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import * as FormateurActions from '../../../../store/formateur/formateur.actions';
import { selectFormateurs, selectFormateursLoading } from '../../../../store/formateur/formateur.selectors';
import { FilterUsersPipe } from '../../../../pipes/filter-users.pipe';
import { CreateUserComponent } from '../../create-user/create-user.component';

@Component({
  selector: 'app-formateurs-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FilterUsersPipe, CreateUserComponent],
  templateUrl: './formateurs-list.component.html'
})
export class FormateursListComponent implements OnInit {
  formateurs$: Observable<User[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  showCreateModal = false;

  constructor(private store: Store) {
    this.formateurs$ = this.store.select(selectFormateurs);
    this.loading$ = this.store.select(selectFormateursLoading);
  }

  ngOnInit(): void {
    this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.store.dispatch(FormateurActions.loadFormateurs());
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  filterFormateurs(formateurs: User[]): User[] {
    if (!this.searchTerm) return formateurs;
    
    const searchLower = this.searchTerm.toLowerCase();
    return formateurs.filter(formateur => 
      formateur.nom.toLowerCase().includes(searchLower) ||
      formateur.prenom.toLowerCase().includes(searchLower)
    );
  }

  onArchive(formateur: User): void {
    if (confirm(`Êtes-vous sûr de vouloir archiver ${formateur.prenom} ${formateur.nom} ?`)) {
      this.store.dispatch(FormateurActions.archiveFormateur({ id: formateur.id }));
    }
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
}
