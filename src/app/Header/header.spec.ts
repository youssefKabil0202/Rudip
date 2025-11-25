import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

describe('header', () => {
  let component: header;
  let fixture: ComponentFixture<header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [header]
    })
    .compileComponents();

    fixture = TestBed.createComponent(header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
