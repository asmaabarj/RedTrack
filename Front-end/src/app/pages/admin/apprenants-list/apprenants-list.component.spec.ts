import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantsListComponent } from './apprenants-list.component';

describe('ApprenantsListComponent', () => {
  let component: ApprenantsListComponent;
  let fixture: ComponentFixture<ApprenantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenantsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprenantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
