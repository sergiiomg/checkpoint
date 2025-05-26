import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesGuardadasComponent } from './publicaciones-guardadas.component';

describe('PublicacionesGuardadasComponent', () => {
  let component: PublicacionesGuardadasComponent;
  let fixture: ComponentFixture<PublicacionesGuardadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicacionesGuardadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesGuardadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
