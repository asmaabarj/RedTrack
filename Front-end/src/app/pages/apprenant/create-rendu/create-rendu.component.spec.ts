import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRenduComponent } from './create-rendu.component';

describe('CreateRenduComponent', () => {
  let component: CreateRenduComponent;
  let fixture: ComponentFixture<CreateRenduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRenduComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRenduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
