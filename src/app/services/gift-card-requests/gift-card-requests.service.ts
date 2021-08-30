import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Request {
  id?: string;
  adminEmail: string;
  email: string;
  gcType: string;
  state: string;
  username: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class GiftCardRequestsService {
  private requests: Observable<Request[]>;
  private requestCollection: AngularFirestoreCollection<Request>;

  constructor(private afs: AngularFirestore) {
    this.requestCollection = this.afs.collection<Request>('usersPointsRedeem', ref => ref.orderBy('timestamp', 'desc'));
    this.requests = this.requestCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
  }

  getRequests(): Observable<Request[]> {
    return this.requests;
  }

  getRequest(id: string): Observable<Request> {
    return this.requestCollection.doc<Request>(id).valueChanges().pipe(
        take(1),
        map(request => {
          request.id = id;
          return request;
        })
    );
  }

  deleteReport(id: string): Promise<void> {
    return this.requestCollection.doc(id).delete();
  }

  updateRequest(id, updateState) {
    let collection;

    return this.afs.firestore.collection('usersPointsRedeem')
        .doc(id).update({state: updateState});
  }
}
