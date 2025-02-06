import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretPreviewComponent } from './secret-preview.component';

describe('SecretPreviewComponent', () => {
  let component: SecretPreviewComponent;
  let fixture: ComponentFixture<SecretPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
