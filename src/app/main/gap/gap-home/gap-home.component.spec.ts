import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapHomeComponent } from './gap-home.component';

describe('GapHomeComponent', () => {
  let component: GapHomeComponent;
  let fixture: ComponentFixture<GapHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GapHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GapHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
