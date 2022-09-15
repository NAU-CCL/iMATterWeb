import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SentRequestPage } from './sent-request.page';

describe('SentRequestPage', () => {
  let component: SentRequestPage;
  let fixture: ComponentFixture<SentRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SentRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
