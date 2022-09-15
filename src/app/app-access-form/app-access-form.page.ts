import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { accessRequest } from '../models/access-request';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/user/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-app-access-form',
  templateUrl: './app-access-form.page.html',
  styleUrls: ['./app-access-form.page.scss'],
})

export class AppAccessFormPage implements OnInit {

  pageCounter:number
  numPages = 1;

  
  application:accessRequest = new accessRequest();

  stateList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  constructor(
    public http:HttpClient,
    public profileService:ProfileService,
    private router:Router,
    public afs:AngularFirestore
  ) { 
    
  }

  ngOnInit() {
    this.pageCounter = 0;
  }

  IncrementCounter():void {
    this.pageCounter++;  
  }

  DecrementCounter():void{
    this.pageCounter--;
  }

  sendEmail(){


    // build the email we will send based on the results of the form
    let data = {
      message: "",
      email: []
     } 

   // form the message
     data.message = `New applicant has requested access to iMATter<br>
     Email: ${this.application.email}<br>
     State: ${this.application.stateOfResidence}<br>
     City: ${this.application.cityOfResidence}<br>
     Has been diagnosed with a substance use disorder: ${this.application.hasSubstanceDisorder}<br>
     Identifies as a woman: ${this.application.isWoman}<br>
     Time in recovery: ${this.application.timeInRevocery}<br>
     Last in recovery: ${this.application.lastInRecovery}<br>
     Will avoid stigmatizing language: ${this.application.avoidStimatizingLang}<br>
     Will Participate respectfully: ${this.application.respectfulParticipation}<br>
     Agrees to tracked usage: ${this.application.trackedUsagePatterns}<br>
     Agrees to be contacted with research opportunities: ${this.application.furtherContact}<br>`

    // get the emails from the settings page with for who will recieve the emails
    let giftCardSettings = this.afs.collection('settings').doc('accessSettings').get().subscribe((result) => {
      data.email = result.get('adminEmails');
      console.log( result.get( 'adminEmails' ) )
      let sendRequestAccessEmail = firebase.functions().httpsCallable( 'sendRequestAccessEmail' )
      console.log( sendRequestAccessEmail );
      sendRequestAccessEmail( data ).then(
       (result) => {
         console.log(result);
         // TODO redirect to a confirmation page
         this.router.navigate(['/sent-request'])
       });
      giftCardSettings.unsubscribe();
    });
  }

}
