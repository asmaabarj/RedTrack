import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapesListComponent } from './etapes-list.component';

describe('EtapesListComponent', () => {
  let component: EtapesListComponent;
  let fixture: ComponentFixture<EtapesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtapesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtapesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
