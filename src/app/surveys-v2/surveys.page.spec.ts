import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveysPage } from './surveys.page';

describe('SurveysPage', () => {
  let component: SurveysPage;
  let fixture: ComponentFixture<SurveysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveysPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
