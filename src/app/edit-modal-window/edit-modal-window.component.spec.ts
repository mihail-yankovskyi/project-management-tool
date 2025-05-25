import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModalWindowComponent } from './edit-modal-window.component';

describe('EditModalWindowComponent', () => {
  let component: EditModalWindowComponent;
  let fixture: ComponentFixture<EditModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModalWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
