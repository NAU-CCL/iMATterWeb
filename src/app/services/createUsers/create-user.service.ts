import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface User {
  id?: string;
  code: string;
  username: string;
  email: string;
  dueMonth: string;
  weeksPregnant: number;
  profilePic: any;
  location: number;
  cohort: string;
  securityQ: string;
  securityA: string;
  joined: any;
  currentEmotion: string;
  bio: string;
  points: number;
  daysSinceLogin: number;
  codeEntered: boolean;
  notes: string;
}

export interface Provider {
  id?: string;
  code: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic: any;
  dob: string;
  bio: string;
  type: string;
  providerType: string;
  notes: string;
  codeEntered: boolean;
}

export interface Admin {
  id?: string;
  code: string;
  username: string;
  email: string;
  password: string;
  type: string;
  profilePic: any;
  notes: string;
  codeEntered: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CreateUserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  private emptyUsers: Observable<User[]>;
  private emptyUserCollection: AngularFirestoreCollection<User>;

  private providers: Observable<Provider[]>;
  private providerCollection: AngularFirestoreCollection<Provider>;

  private admins: Observable<Admin[]>;
  private adminCollection: AngularFirestoreCollection<Admin>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = this.afs.collection<User>('users', ref => ref.orderBy('username', 'asc'));
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.providerCollection = this.afs.collection<Provider>('providers');
    this.providers = this.providerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.adminCollection = this.afs.collection<Admin>('admins');
    this.admins = this.adminCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getEmptyUsers(): Observable<User[]> {
    this.emptyUserCollection = this.afs.collection<User>('users', ref => ref.where('joined', '==', null));
    this.emptyUsers = this.emptyUserCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.emptyUsers;
  }

  getEmptyUser(id: string): Observable<User> {
    return this.emptyUserCollection.doc<User>(id).valueChanges().pipe(
      take(1),
      map(user => {
        user.id = id;
        return user;
      })
    );
  }

  deleteEmptyUser(id: string): Promise<void> {
    return this.emptyUserCollection.doc(id).delete();
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(id: string): Observable<User> {
    return this.userCollection.doc<User>(id).valueChanges().pipe(
      take(1),
      map(user => {
        user.id = id;
        return user;
      })
    );
  }

  updateUser(userID: string, user: User): Promise<void> {
    return this.afs.firestore.collection('users').doc(userID).update({
      email: user.email,
      cohort: user.cohort,
      points: user.points,
      notes: user.notes
    });
  }

  updateUserPoints(userID: string, points: number): Promise<void> {
    return this.afs.firestore.collection('users').doc(userID).update({
      points: points
    })
  }

  deleteUser(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.code).set({ code: user.code, joined: null, codeEntered: false, notes: user.notes });
  }

  getProviders(): Observable<Provider[]> {
    return this.providers;
  }

  getProvider(id: string): Observable<Provider> {
    return this.providerCollection.doc<Provider>(id).valueChanges().pipe(
      take(1),
      map(provider => {
        provider.id = id;
        return provider;
      })
    );
  }

  updateProvider(providerID: string, provider: Provider): Promise<void> {
    return this.afs.firestore.collection('providers').doc(providerID).update({
      email: provider.email,
      firstName: provider.firstName,
      lastName: provider.lastName,
      notes: provider.notes,
      providerType: provider.providerType
    });
  }

  deleteProvider(id: string): Promise<void> {
    return this.providerCollection.doc(id).delete();
  }

  addProvider(provider: Provider) {
    return this.providerCollection.doc(provider.code).set({
      code: provider.code,
      email: provider.email,
      dob: provider.dob,
      firstName: provider.firstName,
      lastName: provider.lastName,
      type: provider.type,
      profilePic: provider.profilePic,
      providerType: provider.providerType,
      codeEntered: false,
      notes: provider.notes
    }, { merge: true });
  }


  getAdmins(): Observable<Admin[]> {
    return this.admins;
  }

  getAdmin(id: string): Observable<Admin> {
    return this.adminCollection.doc<Admin>(id).valueChanges().pipe(
      take(1),
      map(admin => {
        admin.id = id;
        return admin;
      })
    );
  }

  updateAdmin(adminID: string, admin: Admin): Promise<void> {
    return this.afs.firestore.collection('admins').doc(adminID).update({
      notes: admin.notes
    });
  }

  deleteAdmin(id: string): Promise<void> {
    return this.adminCollection.doc(id).delete();
  }

  addAdmin(admin: Admin): Promise<void> {
    return this.adminCollection.doc(admin.code)
      .set({
        code: admin.code,
        email: admin.email,
        type: admin.type,
        codeEntered: false,
        notes: admin.notes
      },
        { merge: true });
  }
}
