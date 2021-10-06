/// <reference types="@types/gapi.auth2" />

import { CalendarComponent, CalendarMode, Step } from 'ionic2-calendar/calendar';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { SurveyService, Survey } from '../services/survey/survey.service';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router, Routes, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { User, UserService } from '../services/user/user.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { elementAt } from 'rxjs/operators';

declare var gapi: any;

@Component({
    selector: 'app-surveys-v2',
    templateUrl: './surveys.page.html',
    styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {
    eventHidden: boolean = true;
    currentEvent: any;

    eventSource = [];
    userSurveys = [];
    scheduler: boolean = false;
    userView: boolean = true;
    viewTitle: string;

    calendar = {
        mode: 'month' as CalendarMode,
        currentDate: new Date(),
        step: 30 as Step,
        locale: 'en-GB',
    };

    selectedDate: Date;
    public view = 'manage';

    public surveys: Observable<Survey[]>;
    public weeklySurveys: Survey[] = [];
    public monthlySurveys: Survey[] = [];

    public users: Observable<User[]>;
    public currentUser: any;

    public title: string;

    public dayMap = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0
    }

    @ViewChild(CalendarComponent, { static: false }) myCal: CalendarComponent;

    constructor(
        private surveyService: SurveyService,
        private storage: Storage,
        private router: Router,
        private toastCtrl: ToastController,
        private http: HttpClient,
        private alertCtrl: AlertController,
        private userService: UserService,
        @Inject(LOCALE_ID) private locale: string,) {
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

        this.surveys.forEach(surveyArray => {
            surveyArray.forEach(survey => {
                // console.log(survey);
                if (survey.type == 'Repeating') {
                    if (survey.characteristics['repeatEvery'] == 'monthly') {
                        console.log(survey.characteristics['display']);
                        this.monthlySurveys.push(survey);
                    }
                    else if (survey.characteristics['repeatEvery'] == 'weekly') {
                        console.log(survey.characteristics['display']);
                        this.weeklySurveys.push(survey);
                    }
                }
            });
        });


        this.getUserEvents();

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
        console.log(event);
        this.currentEvent = event;

        if (!this.currentEvent.allDay) {
            // Use Angular date pipe for conversion
            let start = formatDate(event.startTime, 'medium', this.calendar.locale);
            let end = formatDate(event.endTime, 'medium', this.calendar.locale);

            console.log('Start: ' + start + '\nEnd: ' + end);

            this.eventHidden = false;
        } else {
            console.log(event.id);
            this.router.navigate(["/survey", event.id]);
        }
    }


    getUserEvents() {
        this.eventSource = [];

        this.users = this.userService.getUsers();
        this.users.forEach(userArray => {
            userArray.forEach(user => {
                if (user.answeredSurveys !== undefined) {
                    user.answeredSurveys.forEach(survey => {
                        console.log(survey.timeStart);
                        var startTime = new Date(survey.date + 'T' + survey.timeStart.split(' ')[0] + ':00');

                        this.surveyService.getSurvey(survey.survey).subscribe(event => {
                            this.eventSource.push({
                                title: user.username + ": " + event.title,
                                adminLink: event.adminLink,
                                startTime: startTime,
                                endTime: startTime,
                                allDay: false,
                            });
                            this.myCal.loadEvents();
                            this.userSurveys.push({
                                title: user.username + ": " + event.title,
                                adminLink: event.adminLink,
                                startTime: startTime,
                                endTime: startTime,
                                allDay: false,
                            });
                        });
                    });
                }

            });
        });
    }

    scheduledSurveys() {
        if (!this.scheduler) {
            this.monthlySurveys.forEach(survey => {
                this.addMonthlySurveys(survey);
            });

            this.weeklySurveys.forEach(survey => {
                this.addWeeklySurveys(survey);
            });
            this.scheduler = true;
        } else {
            this.eventSource.forEach(event => {
                if (event.allDay) {
                    this.eventSource.splice(this.eventSource.indexOf(event));
                    this.myCal.loadEvents();
                }
            });
            this.scheduler = false;
        }
    }

    addWeeklySurveys(survey) {
        var today = new Date();
        var years = [today.getFullYear(), today.getFullYear() + 1];
        var created = new Date(survey.dateCreated.seconds * 1000);
        var day = this.dayMap[survey.characteristics['display']];
        var weekdays = this.getWeekdays(created, day);
        weekdays.forEach(day => {
            if (day.getDate() > created.getDay) {
                this.eventSource.push({
                    title: survey.title,
                    startTime: day,
                    endTime: day,
                    allDay: true,
                    id: survey.id
                });
                this.myCal.loadEvents();
            }
        });
        for (var i = created.getMonth(); i <= 11; i++) {
            years.forEach(year => {
                var date = new Date();
                date.setMonth(i);
                date.setFullYear(year);
                this.getWeekdays(date, day).forEach(event => {
                    console.log(event);
                    this.eventSource.push({
                        title: survey.title,
                        startTime: event,
                        endTime: event,
                        allDay: true,
                        id: survey.id
                    });
                    this.myCal.loadEvents();
                });
            });
        }
    }

    addMonthlySurveys(survey) {
        var today = new Date();
        var years = [today.getFullYear(), today.getFullYear() + 1];
        var created = new Date(survey.dateCreated.seconds * 1000);
        var monthCreated = created.getMonth();
        if (created.getDate() > survey.characteristics['display']) {
            monthCreated++;
        }
        for (var i = monthCreated + 1; i <= 12; i++) {
            years.forEach(year => {
                let parsedDate = moment(year + '-' + i + '-' + survey.characteristics['display'], "YYYY-M-D");
                var startDate = parsedDate.toDate();
                var endDate = parsedDate.toDate();
                this.eventSource.push({
                    title: survey.title,
                    startTime: startDate,
                    endTime: endDate,
                    allDay: true,
                    id: survey.id
                });
                this.myCal.loadEvents();
            });
        }
    }

    hideOverlay() {
        this.eventHidden = true;
    }

    getWeekdays(date, day) {
        var d = date || new Date(),
            month = d.getMonth(),
            mondays = [];

        d.setDate(day);

        // Get the first Monday in the month
        while (d.getDay() !== day) {
            d.setDate(d.getDate() + 1);
        }

        // Get all the other Mondays in the month
        while (d.getMonth() === month) {
            mondays.push(new Date(d.getTime()));
            d.setDate(d.getDate() + 7);
        }

        return mondays;
    }
}
