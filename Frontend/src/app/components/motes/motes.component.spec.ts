import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotesComponent } from './motes.component';

describe('MotesComponent', () => {
  let component: MotesComponent;
  let fixture: ComponentFixture<MotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
