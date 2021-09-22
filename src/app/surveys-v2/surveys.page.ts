/// <reference types="@types/gapi.auth2" />

import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { SurveyService, Survey } from '../services/survey/survey.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

declare var gapi: any;

@Component({
    selector: 'app-surveys-v2',
    templateUrl: './surveys.page.html',
    styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {
    eventSource = [];
    viewTitle: string;

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    selectedDate: Date;
    public view = 'manage';

    public surveys: Observable<Survey[]>;

    myCal: CalendarComponent;

    constructor(
        private surveyService: SurveyService,
        private storage: Storage,
        private router: Router,
        private toastCtrl: ToastController,
        private http: HttpClient,
        private alertCtrl: AlertController,
        @Inject(LOCALE_ID) private locale: string) {
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

        this.surveys = this.surveyService.getSurveys();

        gapi.load("client:auth2", function () {
            gapi.auth2.init({ client_id: "626066789753-d0jm6t0ape6tnfvomv2ojuvf73glllk5.apps.googleusercontent.com" });
        });

    }

    showToast(msg: string) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }

    authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/cloud-platform" })
            .then(function () {
                console.log("Sign-in successful");
            },
                function (err) {
                    console.error("Error signing in", err);
                });
    }

    loadClient() {
        gapi.client.setApiKey("AIzaSyAee_ZhwbI6bgXOoRwe_BfkiQAVYMOg4HQ");
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/cloudscheduler/v1/rest")
            .then(function () {
                console.log("GAPI client loaded for API");
            },
                function (err) {
                    console.error("Error loading GAPI client for API", err);
                });
    }

    // Make sure the client is loaded and sign-in is complete before calling this method.
    execute() {
        return gapi.client.cloudscheduler.projects.locations.jobs.run({
            "name": "projects/imatter-nau/locations/us-central1/jobs/survey_notification",
            "resource": {}
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                //this.showToast('Notifications for surveys were successfully sent!');
            },
                function (err) {
                    console.error("Execute error", err);
                    //this.showToast('There was an error sending survey notifications.');
                });
    }

    next() {
        this.myCal.slideNext();
    }

    back() {
        this.myCal.slidePrev();
    }

    // Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    // Calendar event was clicked
    async onEventSelected(event) {
        // Use Angular date pipe for conversion
        let start = formatDate(event.startTime, 'medium', this.locale);
        let end = formatDate(event.endTime, 'medium', this.locale);

        const alert = await this.alertCtrl.create({
            header: event.title,
            subHeader: event.desc,
            message: 'From: ' + start + '<br><br>To: ' + end,
            buttons: ['OK'],
        });
        alert.present();
    }

    createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(
                    Date.UTC(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate() + startDay
                    )
                );
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(
                    Date.UTC(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate() + endDay
                    )
                );
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true,
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + startDay,
                    0,
                    date.getMinutes() + startMinute
                );
                endTime = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + endDay,
                    0,
                    date.getMinutes() + endMinute
                );
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false,
                });
            }
        }
        this.eventSource = events;
    }

    removeEvents() {
        this.eventSource = [];
    }
}
