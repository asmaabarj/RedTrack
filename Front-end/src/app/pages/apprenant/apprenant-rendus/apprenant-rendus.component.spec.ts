import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantRendusComponent } from './apprenant-rendus.component';

describe('ApprenantRendusComponent', () => {
  let component: ApprenantRendusComponent;
  let fixture: ComponentFixture<ApprenantRendusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenantRendusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprenantRendusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
