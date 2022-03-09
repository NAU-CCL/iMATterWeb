import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResourceReviewQuestionsPage } from './resource-review-questions.page';

describe('ResourceReviewQuestionsPage', () => {
  let component: ResourceReviewQuestionsPage;
  let fixture: ComponentFixture<ResourceReviewQuestionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceReviewQuestionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceReviewQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
