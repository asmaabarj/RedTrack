import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { User } from '../../../../models/user.model';
import * as ApprenantActions from '../../../../store/apprenant/apprenant.actions';
import { selectApprenants, selectApprenantsLoading } from '../../../../store/apprenant/apprenant.selectors';

@Component({
  selector: 'app-apprenants-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './apprenants-list.component.html'
})
export class ApprenantsListComponent implements OnInit {
  apprenants$: Observable<User[]>;
  loading$: Observable<boolean>;

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

  onArchive(apprenant: User): void {
    if (confirm(`Êtes-vous sûr de vouloir archiver ${apprenant.prenom} ${apprenant.nom} ?`)) {
      this.store.dispatch(ApprenantActions.archiveApprenant({ id: apprenant.id }));
    }
  }
}
