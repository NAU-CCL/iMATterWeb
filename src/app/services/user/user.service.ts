import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

// declares User object interface, making sure every Survey object has these fields
export interface User {
    id?: string;
    answeredSurveys: any;
    availableSurveys: any;
    bio: string;
    chatNotif: boolean;
    code: string;
    codeEntered: boolean;
    cohort: string;
    completedChallenges: string;
    currentEmotion: string;
    dailyQuote: string;
    daysAUser: number;
    daysRecovery: number;
    daysSinceLogin: number;
    email: string;
    endRehabDate: string;
    infoDeskNotif: boolean;
    joined: any;
    joinedChallenged: any;
    learningModNotif: boolean;
    location: string;
    mood: string;
    password: string;
    points: number;
    profilePic: string;
    recentNotifications: string;
    securityA: string;
    securityQ: string;
    surveyNotif: boolean;
    token: string;
    totalDaysRecovery: number;
    username: string;
    weeksRecovery: number;
}


@Injectable({
    providedIn: 'root'
})

export class UserService {
    private users: Observable<User[]>;
    private userCollection: AngularFirestoreCollection<User>;

    constructor(private angularfs: AngularFirestore) {
        // gets the collection of users
        this.userCollection = this.angularfs.collection<User>('users');

        //  looks for changes and updates, also grabs the data
        this.users = this.userCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    // gets all of the users in the user collection
    getUsers() {
        return this.users;
    }

    // gets an individual user with id provided
    getUser(id: string) {
        return this.userCollection.doc<User>(id).valueChanges().pipe(
            take(1),
            map(user => {
                user.id = id;
                return user;
            })
        );
    }

}