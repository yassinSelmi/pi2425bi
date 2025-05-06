import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepmedicamentComponent } from './deepmedicament.component';

describe('DeepmedicamentComponent', () => {
  let component: DeepmedicamentComponent;
  let fixture: ComponentFixture<DeepmedicamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeepmedicamentComponent]
    });
    fixture = TestBed.createComponent(DeepmedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
