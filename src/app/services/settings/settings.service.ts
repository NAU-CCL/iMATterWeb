import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface GiftCardType {
  id?: string;
  type: string;
}

export interface ProviderType {
  id?: string;
  type: string;
  profilePic: string;
}

export interface mobileNotificationSetting
{
  active: boolean,
  hour: number,
  timeOfDay: string
}

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  private providerTypes: Observable<ProviderType[]>;
  private providerTypeCollection: AngularFirestoreCollection<ProviderType>;

  constructor(public afs: AngularFirestore) {
  }

  static getChatRoomSettings() {
    return firebase.firestore().collection('settings').doc('chatroomSettings').get();
  }

  static getGCSettings() {
    return firebase.firestore().collection('settings').doc('giftCardSettings').get();
  }

  static getUserSignUpSettings() {
    return firebase.firestore().collection('settings').doc('userSignUpSettings').get();
  }

  static getAdminSettings() {
    return firebase.firestore().collection('settings').doc('adminSettings').get();
  }

  static getMobileNotifSettings() {
    return firebase.firestore().collection('settings').doc('mobileNotifSettings').get();
  }

  getProviderTypesCollection() {
    this.providerTypeCollection = this.afs.collection<ProviderType>('providerTypes');

    this.providerTypes = this.providerTypeCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getProviderTypes() {
    this.getProviderTypesCollection();
    return this.providerTypes;
  }

  updateChatHourstoLive(newHours: number) {
    return this.afs.firestore.collection('settings')
        .doc('chatroomSettings').update({hours: Number(newHours)});
  }

  updateNumberOfChatsLive(newNumber: number) {
    return this.afs.firestore.collection('settings')
        .doc('chatroomSettings').update({numberOfChats: Number(newNumber)});
  }

  updateChatLifeType(newLifeType) {
    return this.afs.firestore.collection('settings')
        .doc('chatroomSettings').update({lifeType: newLifeType});
  }

  updateGCEmail(newEmail) {
    return this.afs.firestore.collection('settings')
        .doc('giftCardSettings').update({email: newEmail});
  }

  updatePointsToRedeemGC(newPoints) {
    return this.afs.firestore.collection('settings')
        .doc('giftCardSettings').update({points: newPoints});
  }

  updateMobileNotifications(settingToUpdate, updateObject)
  {
    if (settingToUpdate === "learningModuleOne")
    {
      return this.afs.firestore.collection('settings')
      .doc('mobileNotifSettings').update({learningModuleOne: updateObject});
    }
    else if (settingToUpdate === "learningModuleTwo")
    {
      return this.afs.firestore.collection('settings')
      .doc('mobileNotifSettings').update({learningModuleTwo: updateObject});
    }
    else if (settingToUpdate === "surveyOne")
    {
      return this.afs.firestore.collection('settings')
        .doc('mobileNotifSettings').update({surveyOne: updateObject});
    }
    else if (settingToUpdate === "surveyTwo")
    {
      return this.afs.firestore.collection('settings')
        .doc('mobileNotifSettings').update({surveyTwo: updateObject});
    }
  }

  addGCType(gcType) {
    return this.afs.firestore.collection('settings')
        .doc('giftCardSettings').update({types: firebase.firestore.FieldValue.arrayUnion(gcType)});
  }

  removeGCType(gcType) {
    return this.afs.firestore.collection('settings')
        .doc('giftCardSettings').update({types: firebase.firestore.FieldValue.arrayRemove(gcType)});
  }


  addNewSecurityQ(newQ) {
    return this.afs.firestore.collection('settings')
        .doc('userSignUpSettings').update({securityQs: firebase.firestore.FieldValue.arrayUnion(newQ)});
  }

  removeSecurityQ(newQ) {
    return this.afs.firestore.collection('settings')
        .doc('userSignUpSettings').update({securityQs: firebase.firestore.FieldValue.arrayRemove(newQ)});
  }

  updateAutoProfilePic(newPic) {
    return this.afs.firestore.collection('settings')
        .doc('userSignUpSettings').update({autoProfilePic: newPic});
  }

  updateAdminPic(newPic) {
    return this.afs.firestore.collection('settings')
        .doc('adminSettings').update({profilePic: newPic});
  }

  addNewProfilePic(newPic) {
    return this.afs.firestore.collection('settings')
        .doc('userSignUpSettings').update({profilePictures: firebase.firestore.FieldValue.arrayUnion(newPic)});
  }

  removeProfilePic(pic) {
    return this.afs.firestore.collection('settings')
        .doc('userSignUpSettings').update({profilePictures: firebase.firestore.FieldValue.arrayRemove(pic)});
  }


  addNewProviderType(providerType) {
    return this.providerTypeCollection.add(providerType);
  }

  removeProviderType(docID) {
    return this.providerTypeCollection.doc(docID).delete();
  }

  updateMaxAutoChats( newMaxAutoChats:number )
  {
    this.afs.collection('settings').ref.doc('chatroomSettings').update({maxAutoChatsOnScreen:newMaxAutoChats})
  }

  updateChatLifeSpan( newLifeSpan:number )
  {
    this.afs.collection('settings').ref.doc('chatroomSettings').update({autoChatLifeSpanInSeconds:newLifeSpan})
  }


  // Updates list of comma seeperated emails that denote which admins receive an email notification when a problem report is submitted.
  // Returns the updated list of admin feedback emails as a string array.
  async updateAdminEmails( newEmail: string ): Promise<string[]>
  {
    let currentAdminEmails: string[];
    await this.afs.collection('settings').doc('adminSettings').ref.get().then( (docSnap) => {
      let adminSettings = docSnap.data();
      // Get current admin emails so we can add a new email to it.
      currentAdminEmails = adminSettings.adminEmails;
      
      // Add the new email to the array list of admin emails.
      currentAdminEmails.push(newEmail);

      // Update the document with the new admin emails.
      docSnap.ref.update({'adminEmails': currentAdminEmails});

      console.log(`New admin emails array in service is ${ JSON.stringify(currentAdminEmails) }`);
    })

    return currentAdminEmails;
  }

  getAdminEmails(): Promise<string[]>
  {

    return this.afs.collection('settings').doc('adminSettings').ref.get().then( (docSnap) => {
      let adminSettings = docSnap.data();

      let currentAdminEmails = adminSettings.adminEmails;

      console.log(`Current admin emails array in service is ${currentAdminEmails}`);

      return currentAdminEmails;
    })
  }

  async  removeAdminEmail(emailToRemove: string): Promise<string[]>
  {
    let newAdminEmailsArray: string[];

    await this.afs.collection('settings').doc('adminSettings').ref.get().then( (docSnap) => {
      let adminSettings = docSnap.data();
      // Get current admin emails so we can add a new email to it.
      let currentAdminEmails = adminSettings.adminEmails;
      // Add the new email to the comma seperated list of admin emails.
      newAdminEmailsArray = currentAdminEmails.filter( (email) => {
        return email != emailToRemove;
      });

      // Update the document with the new admin emails.
      docSnap.ref.update({'adminEmails': newAdminEmailsArray});

      console.log(`Removed old admin email ${emailToRemove} new admin email array is ${ JSON.stringify(newAdminEmailsArray) }`);
    })

    return newAdminEmailsArray;
  }

}
