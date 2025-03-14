import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeFormComponent } from './periode-form.component';

describe('PeriodeFormComponent', () => {
  let component: PeriodeFormComponent;
  let fixture: ComponentFixture<PeriodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
