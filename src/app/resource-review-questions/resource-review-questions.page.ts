import { Component, OnInit, Query } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceReviewQuestionsService } from '../services/resource-review-questions.service';
import { ReviewQuestions } from './review-interfaces';

@Component({
  selector: 'app-resource-review-questions',
  templateUrl: './resource-review-questions.page.html',
  styleUrls: ['./resource-review-questions.page.scss'],
})
export class ResourceReviewQuestionsPage implements OnInit {

  // Any explicitly defined FormControls can be retreived using a get method like the one below. get is an AbstractControl method.
  public newResourceQuestionsForm: FormGroup;

  public existingQuestions: ReviewQuestions|undefined;

  public quesFormBuilt: boolean = false;

  public existingQuestionArray = [];
  public existingQuestionTypes = [];
  public existingQuestionTags = [];

  public allResourceTypes;

  public currentQuesNum = 0;


  constructor( private fb: FormBuilder, private afs: AngularFirestore, private getReviewQuestions: ResourceReviewQuestionsService) { }

  ngOnInit() {

   this.getReviewQuestions.getAllResourceTypes().get().then( querySnap => {
     querySnap.forEach( docSnap => {
      this.allResourceTypes = docSnap.data()["types"];


      // {types: [types_array]}
      console.log(`Resource types array ${JSON.stringify( this.allResourceTypes) }`);
      this.initializeQuestionForm()
     })
   });

  


  }


  initializeQuestionForm()
  {
    this.newResourceQuestionsForm = this.fb.group({
      reviewQuestions: this.fb.array([
      ]),

      newQuestions: this.fb.array([
      ])

    });

    // Get current resourceReviewQuestions document from the database.
    this.getReviewQuestions.getReviewQuestionsForResources().get().then( querySnap => {
      querySnap.forEach( docSnap => {
        this.existingQuestions  = docSnap.data() as ReviewQuestions;

        // If for some reason there is not a questions document in the resourceReviewQuestions collection, create a new one from scratch.
        if( this.existingQuestions === undefined)
        {

          // load new question into form.
          this.getNewQuestFormArray.push( this.fb.control( '', Validators.required) )

        }
        // Else fill the form array.
        else
        {

          this.createExistingQuestionFormGroups();
        }

        this.quesFormBuilt = true;
      })
    })
  }


  get getQuestionsFormArray()
  {
    return this.newResourceQuestionsForm.get('reviewQuestions') as FormArray;
  }

  get getNewQuestFormArray()
  {
    return this.newResourceQuestionsForm.get('newQuestions') as FormArray;
  }


  createExistingQuestionFormGroups()
  {
    this.existingQuestionArray = this.existingQuestions['review_questions'];
    this.existingQuestionTypes = this.existingQuestions['review_question_types'];
    this.existingQuestionTags = this.existingQuestions['question_tags'];

    // Load existing questions into form for editing.
    for( let index =0; index < this.existingQuestionArray.length; index++ )
    {
      this.getQuestionsFormArray.push( this.fb.group({
        question_text: [this.existingQuestionArray[index], Validators.required],
        question_type: [ this.existingQuestionTypes[index], Validators.required],
        question_tag: [this.existingQuestionTags[index], Validators.required]
      }) );

    }
  }

  createNewQuestionFormGroups()
  {
    this.getNewQuestFormArray.push(this.fb.group({
      question_text: ['', Validators.required],
      question_type: [ '', Validators.required],
      question_tag: ['', Validators.required]
    }) );
  }


  submitNewResourceQuestions()
  {

    console.log(`FORM GROUP VAL Existing ${ JSON.stringify( this.getQuestionsFormArray.value) }`);
    console.log(`FORM GROUP VAL New ${ JSON.stringify( this.getNewQuestFormArray.value) }`);

    let reviewQuesArray = [];
    let quesTagArray = [];
    let quesTypeArray = [];


    for( let index = 0; index < this.getQuestionsFormArray.value.length; index++)
    {
      let questionObj = this.getQuestionsFormArray.value[index];

      console.log(`QUESTION OBJECT ${JSON.stringify(questionObj)}`)

      reviewQuesArray.push( questionObj['question_text'] );
      quesTagArray.push( questionObj['question_tag']);
      quesTypeArray.push( questionObj['question_type'].toString() );
    }

    for( let index = 0; index < this.getNewQuestFormArray.value.length; index++)
    {
      let questionObj = this.getNewQuestFormArray.value[index];

      console.log(`QUESTION OBJECT ${JSON.stringify(questionObj)}`)

      reviewQuesArray.push( questionObj['question_text'] );
      quesTagArray.push( questionObj['question_tag']);
      quesTypeArray.push( questionObj['question_type'].toString() );
    }



    console.log(`QUES ARRAY ${reviewQuesArray}, QUES TAG ${quesTagArray}, QUES TYPES ${JSON.stringify(quesTypeArray)}`);


    //{ review_questions_id: number, is_current: boolean, review_questions: string[], review_question_types: string[], question_tags: string[] }
      let newQuesObj = {
        review_questions_id: this.existingQuestions['review_questions_id'] + 1,
        is_current: true,
        review_questions: reviewQuesArray,
        review_question_types:  quesTypeArray,
        question_tags: quesTagArray
      }


      this.getReviewQuestions.addNewReviewQuestionsForResources( newQuesObj );


  }

  removeExistingQuestionFromForm(formControlIndex : number )
  {
    let existingQuesFormArray = this.getQuestionsFormArray;

    existingQuesFormArray.removeAt( formControlIndex );
  }

  // Checks if user can delete an existing question. Dont let them delete a question if theres only one left!
  canDeleteExistingQuestion( formControlIndex : number  )
  {
    let existingQuesFormArray = this.getQuestionsFormArray;

    return existingQuesFormArray.length > 1;
  }


  removeNewQuestionFromForm( formControlIndex : number)
  {
    let newQuesFormArray = this.getNewQuestFormArray;

    newQuesFormArray.removeAt( formControlIndex );

  }

  isString(data: any): data is string {
    return typeof data === 'string';
  };

}
