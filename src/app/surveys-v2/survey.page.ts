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

declare var gapi: any;

@Component({
    selector: 'app-survey-v2',
    templateUrl: './survey.page.html',
    styleUrls: ['./survey.page.scss'],
})

export class SurveyPage implements OnInit {
    public surveys: Observable<Survey[]>;

    public surveyTypes = ['Days After Joining', 'Repeating', 'Emotion Triggered'];

    survey: Survey = {
        type: '',
        description: '',
        title: '',
        link: '',
        adminLink: '',
        points: 0,
        importance: '',
        characteristics: {}
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
        console.log(this.survey);
        if (this.survey.id) {
            this.surveyService.updateSurvey(this.survey);
            this.showToast("Survey successfully updated!")
        } else {
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
        this.surveyService.deleteSurvey(id);
        this.router.navigate(['/surveys-v2/']);
        this.showToast("Survey successfully deleted.")
    }

    showToast(msg: string) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }

}
