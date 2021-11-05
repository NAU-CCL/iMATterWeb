/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { SurveyService, Survey } from '../services/survey/survey.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TaskScheduler } from '@angular-devkit/schematics';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { timestamp, Timestamp } from 'rxjs/internal/operators/timestamp';

declare var gapi: any;

@Component({
    selector: 'app-survey-v2',
    templateUrl: './survey.page.html',
    styleUrls: ['./survey.page.scss'],
})

export class SurveyPage implements OnInit {
    public surveys: Observable<Survey[]>;

    public surveyTypes = ['Days After Joining', 'Repeating', 'Emotion Triggered'];

    public userRemindersChecked = false;
    public adminRemindersChecked = false;

    survey: Survey = {
        type: '',
        description: '',
        title: '',
        link: '',
        adminLink: '',
        points: 0,
        importance: '',
        characteristics: {},
        dateCreated: ''
    };

    constructor(
        private surveyService: SurveyService,
        private storage: Storage,
        private router: Router,
        private toastCtrl: ToastController,
        private activatedRoute: ActivatedRoute) {
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

    }

    ionViewWillEnter() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');

        if (!this.surveyTypes.includes(id)) {
            this.surveyService.getSurvey(id).subscribe(survey => {
                this.survey = survey;
                console.log(this.survey);
            });
        } else {
            this.survey.type = id;
            console.log(this.survey);
        }
    }

    logForm() {

        if (this.survey.id) {
            console.log(this.survey);
            this.surveyService.updateSurvey(this.survey);
            this.showToast("Survey successfully updated!")
        } else {
            var now = new Date();
            this.survey.dateCreated = now;
            console.log(this.survey);
            this.surveyService.addSurvey(this.survey);
            this.router.navigate(['surveys-v2']);
        }
    }

    repeat() {
        const repeatVal = document.getElementById("repeatEvery") as HTMLInputElement;
        console.log(repeatVal.value);
        this.survey.characteristics['repeatEvery'] = repeatVal.value;
    }

    delete(id) {
        // if the administrator confirms, the survey will be deleted using the fs service
        this.surveyService.deleteSurvey(this.survey.id).then(() => {
            this.router.navigateByUrl('/surveys-v2');
            this.showToast('Survey deleted');
        }, err => {
            this.showToast('There was a problem deleting your survey');
        });
    }

    showToast(msg: string) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }

}
