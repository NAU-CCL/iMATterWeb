import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'request-access',
    loadChildren: () => import('./app-access-form/app-access-form.module').then(m => m.AppAccessFormPageModule)
  },
  {
    path: 'sent-request',
    loadChildren: () => import('./app-access-form/sent-request/sent-request.module').then( m => m.SentRequestPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./handleUserPages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'code',
    loadChildren: () => import('./handleUserPages/code/code.module').then(m => m.CodePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./handleUserPages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./handleUserPages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'signup/:id', loadChildren: './handleUserPages/signup/signup.module#SignupPageModule'
  },
  {
    path: 'chatlog/:id',
    loadChildren: () => import('./chatlog/chatlog.module').then(m => m.ChatlogPageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsPageModule)
  },
  {
    path: 'surveys',
    loadChildren: () => import('./surveys/surveys.module').then(m => m.SurveysPageModule)
  },
  {
    path: 'surveys/:id',
    loadChildren: () => import('./surveys/surveys.module').then(m => m.SurveysPageModule)
  },
  {
    path: 'survey-list',
    loadChildren: () => import('./survey-list/survey-list.module').then(m => m.SurveyListPageModule)
  },
  {
    path: 'surveys-v2',
    loadChildren: () => import('./surveys-v2/surveys.module').then(m => m.SurveysPageModule)
  },
  {
    path: 'survey/:id',
    loadChildren: () => import('./surveys-v2/survey.module').then(m => m.SurveyPageModule)
  },
  // {
  //   path: 'survey-list',
  //   loadChildren: () => import('./survey-list/survey-list.module').then( m => m.SurveyListPageModule)
  // },
  {
    path: 'challenges',
    loadChildren: () => import('./challenges/challenges.module').then(m => m.ChallengesPageModule)
  },
  {
    path: 'challengeTypes',
    loadChildren: () => import('./challenges/types/challengeTypes.module').then(m => m.ChallengeTypesPageModule)
  },
  // {
  //   path: 'challenge/edit/:id',
  //   loadChildren: () => import('./challenges/new/newChallenge.module').then(m => m.EditChallengePageModule)
  // },
  {
    path: 'newChallenge',
    loadChildren: () => import('./challenges/new/newChallenge.module').then(m => m.NewChallengePageModule)
  },
  {
    path: 'newChallenge/:id',
    loadChildren: () => import('./challenges/new/newChallenge.module').then(m => m.NewChallengePageModule)
  },
  {
    path: 'learningmodules',
    loadChildren: () => import('./learningModule/learningmodules/learningmodules.module')
      .then(m => m.LearningmodulesPageModule)
  },
  { path: 'forum', loadChildren: './forum/forum.module#ForumPageModule' },
  { path: 'forum/:id', loadChildren: './forum/forum-details/forum-details.module#ForumDetailsPageModule' },
  { path: 'forum-thread/:id', loadChildren: './forum/forum-thread/forum-thread.module#ForumThreadPageModule' },

  {
    path: 'provider-home',
    loadChildren: () => import('./provider/provider-home/provider-home.module').then(m => m.ProviderHomePageModule)
  },
  {
    path: 'provider-profile',
    loadChildren: () => import('./provider/provider-profile/provider-profile.module').then(m => m.ProviderProfilePageModule)
  },
  {
    path: 'learning-module-content',
    loadChildren: () => import('./learningModule/learning-module-content/learning-module-content.module')
      .then(m => m.LearningModuleContentPageModule)
  },
  {
    path: 'learning-module-content/:id',
    loadChildren: () => import('./learningModule/learning-module-content/learning-module-content.module')
      .then(m => m.LearningModuleContentPageModule)
  },
  {
    path: 'quiz-modal',
    loadChildren: () => import('./learningModule/quiz-modal/quiz-modal.module').then(m => m.QuizModalPageModule)
  },
  {
    path: 'quiz-modal/:id',
    loadChildren: () => import('./learningModule/quiz-modal/quiz-modal.module').then(m => m.QuizModalPageModule)
  },
  {
    path: 'add-quiz-question',
    loadChildren: () => import('./learningModule/add-quiz-question/add-quiz-question.module').then(m => m.AddQuizQuestionPageModule)
  },
  {
    path: 'viewable-profile/:id',
    loadChildren: () => import('./viewable-profile/viewable-profile.module').then(m => m.ViewableProfilePageModule)
  },
  {
    path: 'chat-cohort-list',
    loadChildren: () => import('./chat-cohort-list/chat-cohort-list.module').then(m => m.ChatCohortListPageModule)
  },
  {
    path: 'pregnancy-updates',
    loadChildren: () => import('./pregnancyUpdates/pregnancy-updates/pregnancy-updates.module').then(m => m.PregnancyUpdatesPageModule)
  },
  {
    path: 'quotes',
    loadChildren: () => import('./quotes/quotes.module').then(m => m.QuotesPageModule)
  },
  {
    path: 'updates-content/:id',
    loadChildren: () => import('./pregnancyUpdates/updates-content/updates-content.module').then(m => m.UpdatesContentPageModule)
  },
  {
    path: 'add-update',
    loadChildren: () => import('./pregnancyUpdates/add-update/add-update.module').then(m => m.AddUpdatePageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxPageModule)
  },
  {
    path: 'gift-card-requests',
    loadChildren: () => import('./gift-card-requests/gift-card-requests.module').then( m => m.GiftCardRequestsPageModule)
  },
  {
    path: 'mobile-settings',
    loadChildren: () => import('./mobile-settings/mobile-settings.module').then(m => m.MobileSettingsPageModule)
  },
  {
    path: 'update-user/:userType/:id',
    loadChildren: () => import('./handleUserPages/update-user/update-user.module').then(m => m.UpdateUserPageModule)
  },
  {
    path: 'recovery-code',
    loadChildren: () => import('./handleUserPages/recovery-code/recovery-code.module').then(m => m.RecoveryCodePageModule)
  },
  {
    path: 'provider-inbox',
    loadChildren: () => import('./provider/provider-inbox/provider-inbox.module').then(m => m.ProviderInboxPageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./locations/locations.module').then(m => m.LocationsPageModule)
  },
  {
    path: 'resource_questions',
    loadChildren: () => import('./resource-review-questions/resource-review-questions.module').then( m => m.ResourceReviewQuestionsPageModule)
  }
  ,
  {
    path: 'add-location',
    loadChildren: () => import('./locations/add-location/add-location.module').then(m => m.AddLocationPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    FormsModule, ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
