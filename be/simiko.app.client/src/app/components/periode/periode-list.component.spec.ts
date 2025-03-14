import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeListComponent } from './periode-list.component';

describe('PeriodeListComponent', () => {
  let component: PeriodeListComponent;
  let fixture: ComponentFixture<PeriodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
