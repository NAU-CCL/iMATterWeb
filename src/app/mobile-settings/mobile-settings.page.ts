/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { SettingsService, GiftCardType, ProviderType, mobileNotificationSetting } from '../services/settings/settings.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, Scheduler } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {HttpClient} from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';



declare var gapi: any;
@Component({
  selector: 'app-mobile-settings',
  templateUrl: './mobile-settings.page.html',
  styleUrls: ['./mobile-settings.page.scss'],
})
export class MobileSettingsPage implements OnInit {

  learningModuleOne: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  learningModuleTwo: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  surveyOne: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  surveyTwo: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }


  constructor(public msService: SettingsService,
              public storage: Storage,
              public router: Router,
              public alertController: AlertController,
              public AFSStorage: AngularFireStorage,
              private http: HttpClient
              ) { }

  providerType: ProviderType = {
    type: '',
    profilePic: ''
  };

  // mobile notification settings
  public LMNotifTime: string; //learning module
  public SurveyNotifTime;

  // from db
  public autoProfilePic: string;
  public adminPic: string;
  public profilePics: Array<string>;
  public securityQs: Array<string>;
  public chatLifeSetting: string;
  public chatHoursToLive: number;
  public chatNumberToLive: number;
  public GCEmail: string;
  public typesOfGC: Array<GiftCardType>;
  public pointsToRedeemGC: number;
  public providerTypes: Observable<any>;
  public autoChatLifeSpan: number;
  public maxAutoChats: number;
  public displayFeedBackSettings: boolean = false;
  public feedbackManagementForm: FormGroup;
  public currentFeedbackEmails: string[];


  // display booleans
  public displayUserSignUp: boolean;
  public displayChatRoom: boolean;
  public displayGCRedeem: boolean;
  public displayAutoPic: boolean;
  public displayProfilePics: boolean;
  public displaySecurityQs: boolean;
  public displayNumberForChats: boolean;
  public displayEmailAdmin: boolean;
  public displayTotalPoints: boolean;
  public displayTypesOfGC: boolean;
  public displayUpdateAutoPic: boolean;
  public displayAddProfilePic: boolean;
  public displayProviderSettings: boolean;
  public displayProviderTypes: boolean;
  public displayAddProviderType: boolean;
  public displayAdminSettings: boolean;
  public displayAdminProfilePic: boolean;
  public displayUpdateAdminPic: boolean;
  public displayNotificationSettings: boolean;
  public displayLMNotifSettings: boolean; //learning module
  public displaySurveyNotifSettings: boolean;

  // Feedback email booleans
  public feedbackEmailAlreadyExists = false;
  public feedbackEmptyEmail = false;
  public feedbackInvalidEmail = false;

  // for uploading image
  UploadedFileURL: Observable<string>;
  fileName: string;
  task: Promise<any>;
  uploadedImage: FileList;
  newImage: boolean;

  public newProviderTypeName: string;
  public newProviderTypeEntered: boolean;

  static getFileName(downloadURL) {
    console.log(downloadURL);
    const fileSplit = downloadURL.split('%2F')[1];
    console.log(fileSplit);
    const filePath = fileSplit.split('?')[0];
    console.log(filePath);
    return filePath;
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
    this.initDisplaysToFalse();

    this.getSecurityQs();
    this.getPointsToRedeemGC();
    this.getCurrentGCEmail();
    this.getGCTypes();
    this.getAutoProfilePic();
    this.getProfilePics();
    this.providerTypes = this.getProviderTypes();
    this.getAdminPic();
    this.getChatSettings();
    this.getMobileNotifSettings();
    this.initFeedbackManagementSettings();

    gapi.load("client:auth2", function() {
      gapi.auth2.init({client_id: "626066789753-d0jm6t0ape6tnfvomv2ojuvf73glllk5.apps.googleusercontent.com"});
    });

  }

  getAutoProfilePic() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.autoProfilePic = result.get('autoProfilePic');
    });
  }

  getAdminPic() {
    SettingsService.getAdminSettings().then((result) => {
      this.adminPic = result.get('profilePic');
    });
  }

  getProfilePics() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.profilePics = result.get('profilePictures');
    });
  }

  getSecurityQs() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.securityQs = result.get('securityQs');
    });
  }

  // Get the chat settings object from the db as a json object.
  getChatSettings()
  {
    SettingsService.getChatRoomSettings().then((docSnap) => {

      // Call .data() to return the doc as an object.
      let chatRoomSettingsObj = docSnap.data();

      this.autoChatLifeSpan = chatRoomSettingsObj.autoChatLifeSpanInSeconds;
      this.maxAutoChats = chatRoomSettingsObj.maxAutoChatsOnScreen;
      console.log(this.chatLifeSetting);
    });
  }

  getCurrentGCEmail() {
    SettingsService.getGCSettings().then((result) => {
      this.GCEmail = result.get('email');
    });
  }

  getPointsToRedeemGC() {
    SettingsService.getGCSettings().then((result) => {
      this.pointsToRedeemGC = result.get('points');
    });
  }

  getGCTypes() {
    SettingsService.getGCSettings().then((result) => {
      this.typesOfGC = result.get('types');
    });
  }

  getMobileNotifSettings() {
    SettingsService.getMobileNotifSettings().then((result) => {
      this.learningModuleOne = result.get('learningModuleOne');
      this.learningModuleTwo = result.get('learningModuleTwo');
      this.surveyOne = result.get('surveyOne');
      this.surveyTwo = result.get('surveyTwo');
    });
  }

  getProviderTypes() {
    return this.msService.getProviderTypes();
  }

  async updateMaxAutoChats(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'How many auto chats should be shown at a once(i.e. "John has entered the chat")?',
      inputs: [
        { name: 'newMaxAutoChats', placeholder: 'Maximum Auto Chats to Show at Once', type: 'number'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateMaxAutoChats(
                data.newMaxAutoChats
            );
            this.maxAutoChats = data.newMaxAutoChats;
          },
        },
      ],
    });
    await alert.present();
  }

  async updateAutoChatLifeSpan(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'How long should auto chats stay visible before disappearing?',
      inputs: [
        { name: 'autoChatLifeSpan', placeholder: 'New auto chat lifespan', type: 'number'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateChatLifeSpan(
                data.autoChatLifeSpan
            );
            this.autoChatLifeSpan = data.autoChatLifeSpan;
          },
        },
      ],
    });
    await alert.present();
  }

  // uses http request to call firebase cloud function that deletes all chats set to not visible
  // use for storage purposes and clearing out old chats in log
  async deleteOldChats() {
    const alert = await this.alertController.create({
      header: 'Delete All Chats Not Visible?',
      message: 'Chats are visible based on the settings provided. i.e. Number of chats or hours to live. Once chats are not' +
          ' in the set visibility standards, they are set to invisible to users but not admins. ' +
          'Confirming this will delete all chats that are currently set to not visible from storage permanently.',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete Messages',
          handler: () => {
            this.http.get('https://us-central1-imatter-nau.cloudfunctions.net/deleteOldChatMessages\n')
                .subscribe((response) => {
                      // this.showToast('Not visible chats have been deleted.');
                  }, err => {
                      // this.showToast('An error occurred. Please try again. ');
                    }
                );
            // this.showToast('Not visible chats have been deleted.');
          }
        }
      ]
    });
    await alert.present();
  }

  async updateGCEmail(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Change who receives gift card redemption emails:',
      inputs: [
        { name: 'newEmail', placeholder: 'New Email'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateGCEmail(
                data.newEmail
            );
            this.getCurrentGCEmail();
          },
        },
      ],
    });
    await alert.present();
  }

  async updatePointsToRedeemGC(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'How many points to redeem gift card?',
      inputs: [
        { name: 'newPoints', placeholder: 'New Point Amount', type: 'number'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updatePointsToRedeemGC(
                Number(data.newPoints)
            );
            this.getPointsToRedeemGC();
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteGCType(currentType): Promise<void> {
    this.msService.removeGCType(currentType);
    this.getGCTypes();
  }

  async addGCType(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'What is the type of gift card?',
      inputs: [
        { name: 'newType', placeholder: 'New Gift Card Type'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.addGCType(
                data.newType);
            this.getGCTypes();
          },
        },
      ],
    });
    await alert.present();
  }

  async addNewSecurityQ(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Enter the new security question option:',
      inputs: [
        { name: 'newQ', placeholder: 'New Security Question'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.addNewSecurityQ(
                data.newQ);
            this.getSecurityQs();
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteSecurityQ(securityQ): Promise<void> {
    this.msService.removeSecurityQ(securityQ);
    this.getSecurityQs();
  }

  async updateAutoProfilePic(picURL): Promise<void> {
    this.msService.updateAutoProfilePic(picURL);
    this.autoProfilePic = picURL;
    this.getAutoProfilePic();
  }

  async addNewProfilePic(event: FileList): Promise<void> {
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `ProfileImages/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.msService.addNewProfilePic(resp);
        this.getProfilePics();
      });
    });
  }

  async deleteProfilePic(pic): Promise<void> {
    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('ProfileImages').child(filePath).delete();
    this.msService.removeProfilePic(pic);
    this.getProfilePics();
  }

  async addNewProviderType(event: FileList, provider: ProviderType): Promise<void> {
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `ProviderProfileImages/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        provider.profilePic = resp;
        this.msService.addNewProviderType(provider);
        this.providerType.type = '';
        this.getProfilePics();
      });
    });
  }

  async deleteProviderType(id, pic) {
    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('ProviderProfileImages').child(filePath).delete();
    this.msService.removeProviderType(id);
    this.providerTypes = this.getProviderTypes();
  }

  async updateAdminPic(event: FileList, pic): Promise<void> {

    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('AdminProfileImage').child(filePath).delete();

    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `AdminProfileImage/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.adminPic = resp;
        this.msService.updateAdminPic(resp);
        this.getAdminPic();
      });
    });
  }


  initDisplaysToFalse() {
    this.displayUserSignUp = false;
    this.displayChatRoom = false;
    this.displayGCRedeem = false;
    this.displayAutoPic = false;
    this.displayProfilePics = false;
    this.displaySecurityQs = false;
    this.displayNumberForChats = false;
    this.displayEmailAdmin = false;
    this.displayTotalPoints = false;
    this.displayTypesOfGC = false;
    this.displayProviderSettings = false;
    this.displayProviderTypes = false;
    this.displayAddProviderType = false;
    this.displayAdminSettings = false;
    this.displayAdminProfilePic = false;
    this.displayUpdateAdminPic = false;
    this.displayNotificationSettings = false;
    this.displayLMNotifSettings = false;
    this.displaySurveyNotifSettings = false;
  }

  displaySubCategories(display, displayType) {
    if (displayType === 'userSignUp') 
    {
      this.displayAutoPic = display;
      this.displayProfilePics = display;
      this.displaySecurityQs = display;

    } 
    else if (displayType === 'giftCard') 
    {
      this.displayEmailAdmin = display;
      this.displayTotalPoints = display;
      this.displayTypesOfGC = display;
    } 
    else if (displayType === 'provider') 
    {
      this.displayProviderTypes = display;
    } 
  }

  ionViewWillLeave() {
    this.initDisplaysToFalse();
  }


//BELOW IS MOBILE NOTIFICATIONS SETTINGS CODE

/**
 * Handling converting the AM/PM hours to 24hour version to use in cron job
 */
convertTo24Hour(hour:number, timeOfDay:String)
{
  if (timeOfDay === "AM")
  {
    if (hour === 12)
    {
      return 0;
    }
    else
    {
      return hour;
    }
  }
  else if (timeOfDay === "PM")
  {
    if (hour === 12)
    {
      return hour;
    }
    else
    {
      return ((24-12) + hour);
    }
  }

}

/**
 * Creates the string that will be used to configure the cloud function trigger time
 * Operates under the assumption these jobs will run once a day on the given hour
 * @param hourTwo optional
 */
formCronTime(hourOne:number, hourTwo:number = null)
{
  var cronString;
  var hourOneString = hourOne.toString();

  if (hourTwo === null)
  {
    cronString = "0 " + hourOneString + " * * *";
    console.log("CRON STRING: " + cronString);
    
    return cronString;
  }
  else if (hourTwo !== null)
  {
    var hourTwoString = hourTwo.toString();
    cronString = "0 " + hourOneString + "," + hourTwoString + " * * *";
    console.log("CRON STRING: " + cronString);

    return cronString;
  }
}

/**
 * Update learning module notification settings in the database
 * Calculate the LMNotifTime
 */
updateLMNotifSettings()
{
  this.msService.updateMobileNotifications("learningModuleOne", this.learningModuleOne);
  this.msService.updateMobileNotifications("learningModuleTwo", this.learningModuleTwo);

  var hourOne = this.convertTo24Hour(this.learningModuleOne.hour, this.learningModuleOne.timeOfDay);

  if (this.learningModuleTwo.active === true)
  {
    var hourTwo = this.convertTo24Hour(this.learningModuleTwo.hour, this.learningModuleTwo.timeOfDay);
    this.LMNotifTime = this.formCronTime(hourOne, hourTwo);
  }
  else
  {
    this.LMNotifTime = this.formCronTime(hourOne);
  }

}

/**
 * Update survey notification settings in the database
 * Calculate surveyNotifTime
 */
updateSurveyNotifSettings()
{
  this.msService.updateMobileNotifications("surveyOne", this.surveyOne);
  this.msService.updateMobileNotifications("surveyTwo", this.surveyTwo);

  var hourOne = this.convertTo24Hour(this.surveyOne.hour, this.surveyOne.timeOfDay);

  if (this.surveyTwo.active === true)
  {
    var hourTwo = this.convertTo24Hour(this.surveyTwo.hour, this.surveyTwo.timeOfDay);
    this.SurveyNotifTime = this.formCronTime(hourOne, hourTwo);
  }
  else
  {
    this.SurveyNotifTime = this.formCronTime(hourOne);
  }
}

  authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/cloud-platform"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }

  loadClient() {
    gapi.client.setApiKey("AIzaSyAee_ZhwbI6bgXOoRwe_BfkiQAVYMOg4HQ");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/cloudscheduler/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  
  // Updating Learning Module Notifications
  executeLearningModuleNotif(crontab) {
    return gapi.client.cloudscheduler.projects.locations.jobs.patch({
      "name": "projects/imatter-nau/locations/us-central1/jobs/learning_module_notification",
      "updateMask": "schedule",
      "resource": {
        "schedule": crontab
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

  // Updating Survey Notifications
  executeSurveyNotif(crontab) {
    return gapi.client.cloudscheduler.projects.locations.jobs.patch({
      "name": "projects/imatter-nau/locations/us-central1/jobs/survey_notification",
      "updateMask": "schedule",
      "resource": {
        "schedule": crontab
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
          header,
          message,
          buttons: ['OK']
      });

    await alert.present();
  }

  displayHelpInfo()
  {
    this.presentAlert('About Mobile Notifications',
      'Newly added learning modules and surveys will not appear to users until push notifications are sent for them. ' +
      '<br><br> This configures the times that notifications for new learning modules and surveys will be sent to mobile application users.' +
      '<br><br> The second notification time setting is optional and can be turned on and off using the toggle.');
  }

  initFeedbackManagementSettings()
  {
    this.feedbackManagementForm = new FormGroup({
      newFeedbackEmail: new FormControl('')
    });

    this.msService.getAdminEmails().then( (adminEmailString) => {
      this.currentFeedbackEmails = adminEmailString;
    })
  }

  addNewEmailInput()
  {
    let formWarnings = document.querySelector('.form-warning') as HTMLSpanElement;

    if( formWarnings != null)
    {
      formWarnings.classList.remove('animate-form-warning');

      setTimeout(()=>{formWarnings.classList.add('animate-form-warning')}, 100);
    }

    this.feedbackEmailAlreadyExists = false;
    this.feedbackEmptyEmail = false;
    this.feedbackInvalidEmail = false;

    

    // Get the new email from the form group
    let newEmailToAdd = this.feedbackManagementForm.controls.newFeedbackEmail.value;

    // If the email already exists, do not add it again.
    if( this.currentFeedbackEmails.includes(newEmailToAdd.trim()) )
    {
      this.feedbackEmailAlreadyExists = true;
      return false;
    }
    else if( newEmailToAdd.trim() === '' ) // If email only contains whitespace.
    {
      this.feedbackEmptyEmail = true;
      return false;
    }
    // check if the email entered is of the form anything@anything.anything. This is not an exhaustive check by any means. 
    // This is extreamly basic and only looks for the @ and . characters with stuff inbetween them.
    else if( /[^@]+@.+\..+/.exec(newEmailToAdd) === null ) 
    {
      this.feedbackInvalidEmail = true;
      return false;
    }
    /*
    let formWarnings = document.querySelector('.form-warning') as HTMLSpanElement;
    
    formWarnings.classList.remove('animate-form-warning');

    formWarnings.classList.add('animate-form-warning');
*/

    // Add the new email to the list of feedback emails.
    this.msService.updateAdminEmails( newEmailToAdd ).then((newAdminEmails) =>{
      //console.log(`New Admin emails returned from component promise is ${newAdminEmails}`);
      this.currentFeedbackEmails = newAdminEmails;
    });

    this.feedbackManagementForm.controls.newFeedbackEmail.setValue('');
  }

  removeExistingAdminEmail( existingEmail )
  {
    this.msService.removeAdminEmail(existingEmail).then((newAdminEmailArray) => {
      this.currentFeedbackEmails = newAdminEmailArray;
    });
  }
}

