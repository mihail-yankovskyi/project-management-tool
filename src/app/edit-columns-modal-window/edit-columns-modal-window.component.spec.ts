import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditColumnsModalWindowComponent } from './edit-columns-modal-window.component';

describe('EditColumnsModalWindowComponent', () => {
  let component: EditColumnsModalWindowComponent;
  let fixture: ComponentFixture<EditColumnsModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditColumnsModalWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditColumnsModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
