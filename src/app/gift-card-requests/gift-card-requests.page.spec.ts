import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftCardRequestsPage } from './gift-card-requests.page';

describe('GiftCardRequestsPage', () => {
  let component: GiftCardRequestsPage;
  let fixture: ComponentFixture<GiftCardRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftCardRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
