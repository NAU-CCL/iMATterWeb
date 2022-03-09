import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, Query } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { ReviewQuestions } from 'src/app/resource-review-questions/review-interfaces' ;
import { Review } from 'src/app/resource-review-questions/review-interfaces' ;


@Injectable({
  providedIn: 'root'
})
export class ResourceReviewQuestionsService {

  public reviewQuestionCollection: AngularFirestoreCollection;

  constructor( private afs: AngularFirestore ) {

    //this.generateReviewQuestionsCollec();

   }

   generateReviewQuestionsCollec()
   {
    let reviewQuestions = this.afs.collection<ReviewQuestions>('resourceReviewQuestions');

    reviewQuestions.add({ review_questions_id: 1, is_current: true, review_questions: ['Can have dog?', 'Can use kratom?', 'Couples Allowed?', 'Is co-ed?'], review_question_types: ['All','All','All','All'], question_tags: ['Dogs Allowed', 'Kratom Allowed', 'Couples Allowed', 'Is Co-ed'] });

   }

   // Returns a Query object that contains a query snap shot which contains a document snapshot of the resourceReviewQuestions document
  getReviewQuestionsForResources( ) : Query
  {
    // This code returns a query, you can call .get on a query to get a promise that returns a query snapshot!
    // Query snapshot contains zero or more DocumentSnapshots. Use forEach on the querySnapshot to iterate through the DocumentSnapshots
    // Call .data on a Document snapshot to get that docs data.
    return this.afs.collection<ReviewQuestions[]>('resourceReviewQuestions').ref.where('is_current','==', true ).limit(1);

    
  }

  getAllResourceTypes() : Query
  {
    // Get single document from the collection.
    return this.afs.collection<string[]>('resourceTypes').ref.limit(1);
  }

  
  // Get all reviews for a resource.
  getReviewsForResource( resource_id: number): Observable<Review[]>
  {
    return this.afs.collection<Review>("resourceReviews", ref => ref.where('resourceID','==', resource_id)).valueChanges();
  }

  async addNewReviewQuestionsForResources( newQuestions: ReviewQuestions )
  {
    // Get the current review question document so we can change its is_current field to false.
    await this.afs.collection<ReviewQuestions[]>('resourceReviewQuestions').ref.where('is_current','==', true ).limit(1).get().then( querySnap =>{
      querySnap.forEach( docSnap => {
        docSnap.ref.update({is_current: false});
        
        this.afs.collection('resourceReviewQuestions').ref.add(newQuestions);

        return true;
      })
    });

  }


}
