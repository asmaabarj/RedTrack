import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEtapeComponent } from './create-etape.component';

describe('CreateEtapeComponent', () => {
  let component: CreateEtapeComponent;
  let fixture: ComponentFixture<CreateEtapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEtapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEtapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
