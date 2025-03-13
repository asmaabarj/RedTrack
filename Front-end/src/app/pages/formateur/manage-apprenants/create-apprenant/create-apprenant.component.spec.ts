import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApprenantComponent } from './create-apprenant.component';

describe('CreateApprenantComponent', () => {
  let component: CreateApprenantComponent;
  let fixture: ComponentFixture<CreateApprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApprenantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
