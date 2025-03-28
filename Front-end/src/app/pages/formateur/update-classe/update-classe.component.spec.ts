import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClasseComponent } from './update-classe.component';

describe('UpdateClasseComponent', () => {
  let component: UpdateClasseComponent;
  let fixture: ComponentFixture<UpdateClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
