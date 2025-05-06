import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespiratoryDiseaseComponent } from './respiratory-disease.component';

describe('RespiratoryDiseaseComponent', () => {
  let component: RespiratoryDiseaseComponent;
  let fixture: ComponentFixture<RespiratoryDiseaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RespiratoryDiseaseComponent]
    });
    fixture = TestBed.createComponent(RespiratoryDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
