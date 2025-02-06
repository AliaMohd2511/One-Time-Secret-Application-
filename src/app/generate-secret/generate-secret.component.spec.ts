import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSecretComponent } from './generate-secret.component';

describe('GenerateSecretComponent', () => {
  let component: GenerateSecretComponent;
  let fixture: ComponentFixture<GenerateSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateSecretComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
