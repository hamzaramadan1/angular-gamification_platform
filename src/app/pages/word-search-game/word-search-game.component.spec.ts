import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSearchGameComponent } from './word-search-game.component';

describe('WordSearchGameComponent', () => {
  let component: WordSearchGameComponent;
  let fixture: ComponentFixture<WordSearchGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordSearchGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordSearchGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
