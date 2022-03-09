import { Component, OnInit } from '@angular/core';
import { PregnancyUpdatesService, PregnancyUpdateCard } from '../../services/PregnancyUpdates/pregnancy-updates.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.page.html',
  styleUrls: ['./add-update.page.scss'],
})
export class AddUpdatePage implements OnInit {

  pregnancyUpdateCard: PregnancyUpdateCard =
      {
        day: 0,
        fileName: '',
        description: '',
        picture: ''
      };

  public UploadedFileURL: Observable<string>;
  public fileName: string;
  public task: Promise<any>;
  public uploadedImage: FileList;
  public pregnancyUpdateForm: FormGroup;

  constructor(
      public activatedRoute: ActivatedRoute,
      public pregnancyUpdatesService: PregnancyUpdatesService,
      public router: Router,
      public toastCtrl: ToastController,
      public storage: Storage,
      public AFSStorage: AngularFireStorage,
      public afs: AngularFirestore,
      public formBuilder: FormBuilder) {

    this.pregnancyUpdateForm = this.formBuilder.group({
      day: ['',
        Validators.compose([Validators.required, Validators.minLength(1),
          Validators.pattern('^([01]?[0-9]?[0-9]|2[0-7][0-9]|28[0])$')])],
      description: ['',
        Validators.compose([Validators.required, Validators.minLength(1)])],
    });
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

  }

  async addPregnancyUpdate(pregnancyUpdateForm: FormGroup) {
    if (!pregnancyUpdateForm.valid) {
      this.showToast('Incomplete Pregnancy Update');
    } else {

      this.afs.firestore.collection('pregnancyUpdates').where('day', '==', Number(this.pregnancyUpdateForm.value.day))
          .get().then(snap => {
        if (snap.docs.length > 0) {
          this.showToast('An update for this day has already been created! Please delete that one before continuing or update for that day.');
        } else {
          this.pregnancyUpdateCard.day = Number(pregnancyUpdateForm.value.day);
          this.pregnancyUpdateCard.description = pregnancyUpdateForm.value.description;
          this.pregnancyUpdatesService.addPregnancyUpdate(this.pregnancyUpdateCard).then(() => {
            this.router.navigateByUrl('/pregnancy-updates');
            this.showToast('Pregnancy update added');
            this.pregnancyUpdateForm.reset();
          }, err => {
            this.showToast('There was a problem adding your pregnancy update');
          });
        }
      });
    }
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  async uploadImage(event: FileList, pregnancyUpdateForm) {

    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `PregUpdateImages/${new Date().getTime()}_${file.name}`;
    this.pregnancyUpdateCard.fileName = `${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.pregnancyUpdateCard.picture = resp;
        this.addPregnancyUpdate(pregnancyUpdateForm);
      });
    });
  }
}
