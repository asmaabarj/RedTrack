import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import * as FormateurActions from '../../../../store/formateur/formateur.actions';
import { selectFormateurs, selectFormateursLoading } from '../../../../store/formateur/formateur.selectors';

@Component({
  selector: 'app-formateurs-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './formateurs-list.component.html'
})
export class FormateursListComponent implements OnInit {
  formateurs$: Observable<User[]>;
  loading$: Observable<boolean>;

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

  onArchive(formateur: User): void {
    if (confirm(`Êtes-vous sûr de vouloir archiver ${formateur.prenom} ${formateur.nom} ?`)) {
      this.store.dispatch(FormateurActions.archiveFormateur({ id: formateur.id }));
    }
  }
}
