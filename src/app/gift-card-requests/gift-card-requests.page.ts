import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GiftCardRequestsService, Request } from '../services/gift-card-requests/gift-card-requests.service';
import { elementAt } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Survey, SurveyService } from '../services/survey/survey.service';
import { CreateUserService, User } from '../services/createUsers/create-user.service';

@Component({
  selector: 'app-gift-card-requests',
  templateUrl: './gift-card-requests.page.html',
  styleUrls: ['./gift-card-requests.page.scss'],
})
export class GiftCardRequestsPage implements OnInit {
  private userCode: string;
  private userEmail: string;

  public view = 'manage';
  public selectedState: string;
  public viewRequest: Request;

  public requests: Observable<Request[]>;
  public surveys: Observable<Survey[]>;
  public users: Observable<User[]>;

  overlayHidden: boolean = true;

  constructor(public router: Router,
    public storage: Storage,
    public gcService: GiftCardRequestsService,
    public afs: AngularFirestore,
    public surveyService: SurveyService,
    public userService: CreateUserService) {
  }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);

      } else {
        this.storage.get('type').then((value) => {
          if (value !== 'admin') {
            this.router.navigate(['/login/']);
          }
        });
      }
    });

    this.requests = this.gcService.getRequests();
    this.surveys = this.surveyService.getSurveys();
    this.users = this.userService.getUsers();
    console.log("users: \n" + this.users);

    this.selectedState = 'new';
  }

  viewRequestDetails(id) {
    const tempRequest = this.gcService.getRequest(id);
    tempRequest.subscribe(event => this.viewRequest = event);
    this.overlayHidden = false;
    console.log(this.viewRequest);
  }

  public assign() {
    this.gcService.updateRequest(this.viewRequest.id, "pending");
    this.hideOverlay();
  }

  public complete() {
    this.gcService.updateRequest(this.viewRequest.id, "complete");
    this.hideOverlay();
  }

  public hideOverlay() {
    this.overlayHidden = true;
  }

}
