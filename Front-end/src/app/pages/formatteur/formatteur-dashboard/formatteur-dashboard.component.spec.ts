import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatteurDashboardComponent } from './formatteur-dashboard.component';

describe('FormatteurDashboardComponent', () => {
  let component: FormatteurDashboardComponent;
  let fixture: ComponentFixture<FormatteurDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatteurDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatteurDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
