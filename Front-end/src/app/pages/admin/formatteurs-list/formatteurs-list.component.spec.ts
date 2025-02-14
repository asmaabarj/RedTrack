import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatteursListComponent } from './formatteurs-list.component';

describe('FormatteursListComponent', () => {
  let component: FormatteursListComponent;
  let fixture: ComponentFixture<FormatteursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatteursListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatteursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
