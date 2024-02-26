import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepagoComponent } from './prepago.component';

describe('PrepagoComponent', () => {
  let component: PrepagoComponent;
  let fixture: ComponentFixture<PrepagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrepagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
