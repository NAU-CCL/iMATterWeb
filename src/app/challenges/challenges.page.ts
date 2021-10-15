import { Component, OnInit } from '@angular/core';
import { ChallengeService, Challenge } from '../services/challenges/challenges.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
    selector: 'challenges',
    templateUrl: './challenges.page.html',
    styleUrls: ['./challenges.page.scss'],
})
export class ChallengesPage implements OnInit {
    public challenges: Observable<Challenge[]>;

    challenge: Challenge = {
        title: '',
        description: '',
        type: '',
        length: 0,
        coverPicture: '',
        contents: []
    };

    constructor(private fs: ChallengeService,
        private storage: Storage,
        private router: Router,
        private toastCtrl: ToastController) {
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

        this.challenges = this.fs.getChallenges();
    }

    readJSON() {
        const file = (document.getElementById('fileUpload') as HTMLInputElement).files[0];
        console.log(file);
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const contents = JSON.parse(reader.result as string);
            console.log(contents);
            this.challenge = contents;
            this.fs.addChallenge(this.challenge).then(() => {
                this.showToast('Challenge uploaded');
            });
        };
        (document.getElementById('fileUpload') as HTMLInputElement).value = null;
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
}
