import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReponseRenduComponent } from './create-reponse-rendu.component';

describe('CreateReponseRenduComponent', () => {
  let component: CreateReponseRenduComponent;
  let fixture: ComponentFixture<CreateReponseRenduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReponseRenduComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateReponseRenduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
