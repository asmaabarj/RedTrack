import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Class } from '../../../models/class.model';
import * as FormateurClassesActions from '../../../store/formateur-classes/formateur-classes.actions';
import { 
  selectFormateurClasses, 
  selectFormateurClassesLoading,
  selectFormateurClassesError 
} from '../../../store/formateur-classes/formateur-classes.selectors';
import { UpdateClasseComponent } from '../update-classe/update-classe.component';
import { EtapesListComponent } from '../manage-etapes/etapes-list/etapes-list.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    UpdateClasseComponent, 
    EtapesListComponent,
    RouterModule
  ],
  templateUrl: './formateur-dashboard.component.html'
})
export class FormateurDashboardComponent implements OnInit {
  classes$: Observable<Class[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showUpdateModal = false;
  selectedClasse: Class | null = null;

  constructor(private store: Store) {
    this.classes$ = this.store.select(selectFormateurClasses);
    this.loading$ = this.store.select(selectFormateurClassesLoading);
    this.error$ = this.store.select(selectFormateurClassesError);

    this.classes$.subscribe(classes => {
      console.log('Classes in component:', classes);
    });
    
    this.error$.subscribe(error => {
      if (error) console.error('Error in component:', error);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(FormateurClassesActions.loadFormateurClasses());
  }

  onEdit(classe: Class): void {
    this.selectedClasse = classe;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedClasse = null;
  }
}
