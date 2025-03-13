import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Class } from '../../../models/class.model';
import * as ApprenantClassesActions from '../../../store/apprenant-classes/apprenant-classes.action';
import { 
  selectApprenantClasses, 
  selectApprenantClassesLoading,
  selectApprenantClassesError 
} from '../../../store/apprenant-classes/apprenant-classes.selectors';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './apprenant-dashboard.component.html'
   
  
})
export class ApprenantDashboardComponent {
classes$: Observable<Class[]>;
loading$: Observable<boolean>;
error$: Observable<string | null>;
showUpdateModal = false;
selectedClasse: Class | null = null;

constructor(private store: Store) {
  this.classes$ = this.store.select(selectApprenantClasses);
  this.loading$ = this.store.select(selectApprenantClassesLoading);
  this.error$ = this.store.select(selectApprenantClassesError);

  // Debug subscriptions
  this.classes$.subscribe(classes => {
    console.log('Classes in component:', classes);
  });
  
  this.error$.subscribe(error => {
    if (error) console.error('Error in component:', error);
  });
}

ngOnInit(): void {
  this.store.dispatch(ApprenantClassesActions.loadApprenantClasses());
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
