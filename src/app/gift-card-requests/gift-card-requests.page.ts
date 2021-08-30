import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GiftCardRequestsService, Request } from '../services/gift-card-requests/gift-card-requests.service';
import { elementAt } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-gift-card-requests',
  templateUrl: './gift-card-requests.page.html',
  styleUrls: ['./gift-card-requests.page.scss'],
})
export class GiftCardRequestsPage implements OnInit {
  private userCode: string;
  private userEmail: string;

  public newRequests: boolean;
  public pending: boolean;
  public completed: boolean;
  public selectedState: string;
  public viewRequest: Request;

  public requests: Observable<Request[]>;

  overlayHidden: boolean = true;

  constructor(public router: Router,
    public storage: Storage,
    public gcService: GiftCardRequestsService,
    public afs: AngularFirestore) {
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
    this.newRequests = true;
    this.pending = false;
    this.completed = false;
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
