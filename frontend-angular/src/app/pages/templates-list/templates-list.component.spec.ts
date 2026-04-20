import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesListComponent } from './templates-list.component';

describe('TemplatesListComponent', () => {
  let component: TemplatesListComponent;
  let fixture: ComponentFixture<TemplatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
