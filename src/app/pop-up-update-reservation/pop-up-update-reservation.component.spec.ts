import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUpdateReservationComponent } from './pop-up-update-reservation.component';

describe('PopUpUpdateReservationComponent', () => {
  let component: PopUpUpdateReservationComponent;
  let fixture: ComponentFixture<PopUpUpdateReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpUpdateReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpUpdateReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
