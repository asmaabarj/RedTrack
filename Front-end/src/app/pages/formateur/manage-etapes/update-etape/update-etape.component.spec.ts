import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEtapeComponent } from './update-etape.component';

describe('UpdateEtapeComponent', () => {
  let component: UpdateEtapeComponent;
  let fixture: ComponentFixture<UpdateEtapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEtapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEtapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
