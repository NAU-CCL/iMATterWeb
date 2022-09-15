import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppAccessFormPage } from './app-access-form.page';

describe('AppAccessFormPage', () => {
  let component: AppAccessFormPage;
  let fixture: ComponentFixture<AppAccessFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccessFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppAccessFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
