import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainStrokeComponent } from './brain-stroke.component';

describe('BrainStrokeComponent', () => {
  let component: BrainStrokeComponent;
  let fixture: ComponentFixture<BrainStrokeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrainStrokeComponent]
    });
    fixture = TestBed.createComponent(BrainStrokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
