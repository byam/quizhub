import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { AddComponent } from './add.component';
import { UpdateComponent } from './update.component';
import { CourseComponent } from './course.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AddQuestionComponent } from './add-question.component';
import { UpdateQuestionComponent } from './update-question.component';
import { QuestionComponent } from './question.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    UpdateComponent,
    CourseComponent,
    AddQuestionComponent,
    UpdateQuestionComponent,
    QuestionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ListComponent },
      { path: 'add', component: AddComponent },
      { path: 'update/:course_id', component: UpdateComponent },
      { path: ':course_id', component: CourseComponent }, // must be last
      { path: ':course_id/questions/add', component: AddQuestionComponent },
      {
        path: ':course_id/questions/update/:question_id',
        component: UpdateQuestionComponent,
      },
      {
        path: ':course_id/questions/:question_id', // must be last
        component: QuestionComponent,
      },
    ]),
  ],
})
export class CoursesModule {}
