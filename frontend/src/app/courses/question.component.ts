import { Component, inject } from '@angular/core';
import {
  CoursesService,
  IComment,
  ICourse,
  IQuestion,
  IReaction,
  IReactionsCount,
} from './courses.service';
import { StateService } from '../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IState } from '../interfaces/state';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-question',
  template: `
    <section class="bg-white dark:bg-gray-900 py-8 lg:py-16">
      <div class="max-w-2xl mx-auto px-4">
        <!-- Question -->
        <h2 class="text-lg lg:text-1xl text-gray-900 dark:text-white">
          {{ course.course_code }} {{ course.title }}
        </h2>
        <div class="flex justify-between items-center mb-6">
          <h2
            class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
          >
            Q: {{ question.text }} ?
          </h2>
        </div>

        <!-- Answers -->
        <div
          *ngFor="let choice of question.choices; let i = index"
          class="sm:col-span-2"
        >
          <label
            class="block mb-2 text-sm font-small text-gray-900 dark:text-white"
            >Answer: {{ i + 1 }}</label
          >
          <p
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            {{ choice }}
          </p>
        </div>
        <br />

        <!-- Question Reaction -->
        <span
          (click)="addReaction('up')"
          type="button"
          class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          Up: {{ reactionsCount.up }}
        </span>

        <span
          (click)="addReaction('down')"
          type="button"
          class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          Down: {{ reactionsCount.down }}
        </span>
        <br />

        <!-- Show answer if show button is clicked -->
        <br />
        <br />

        <button
          (click)="toggleShowAnswer()"
          type="button"
          class="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
        >
          {{ is_show_answer ? 'Hide Answer' : 'Show Answer' }}
        </button>

        <div *ngIf="is_show_answer">
          <div class="relative w-full max-w-2xl max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div
                class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
              >
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  <p>Correct Answer: {{ question.correctIndex }}</p>
                </h3>
              </div>
              <div class="p-6 space-y-6">
                <p
                  class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                >
                  {{ question.explanation }}
                </p>

                <figcaption class="flex items-center mt-4 space-x-3">
                  <img
                    class="w-6 h-6 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    alt="profile picture"
                  />
                  <div
                    class="flex items-center divide-x-2 divide-gray-300 dark:divide-gray-700"
                  >
                    <cite
                      class="pr-3 font-medium text-gray-900 dark:text-white"
                    >
                      <!-- question user name or unknown -->
                      {{ question.user ? question.user.name : 'Unknown' }}
                    </cite>
                    <!-- date format local -->
                    <cite class="pl-3 text-sm text-gray-500 dark:text-gray-400">
                      {{ question.updatedAt | date : 'medium' }}</cite
                    >
                  </div>
                </figcaption>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Count-->
        <div class="flex justify-between items-center mb-6">
          <h4
            class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
          >
            Comments ({{ comments.length }})
          </h4>
        </div>

        <!-- Add New Comment -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="mb-6">
          <div
            class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <label for="comment" class="sr-only">Your comment</label>
            <textarea
              formControlName="text"
              id="text"
              rows="6"
              class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            [disabled]="!form.valid"
            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Post comment
          </button>
        </form>

        <!-- Existing comments -->
        <div *ngFor="let comment of comments; let i = index">
          <article
            class="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
          >
            <footer class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <p
                  class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
                >
                  <!-- TODO: icon for user -->
                  <img
                    class="mr-2 w-6 h-6 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                    alt="{{ comment.user.name }}"
                  />{{ comment.user.name }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <cite class="pl-3 text-sm text-gray-500 dark:text-gray-400">
                    {{ comment.createdAt | date : 'medium' }}</cite
                  >
                </p>
              </div>

              <!-- Dropdown menu -->
              <!-- Todo edit comment button -->
              <!-- remove course button -->
              <button
                *ngIf="state._id == comment.user._id"
                (click)="removeComment(comment._id)"
                type="button"
                class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Delete
              </button>
            </footer>

            <!-- Comment Text -->
            <p class="text-gray-500 dark:text-gray-400">{{ comment.text }}</p>

            <!-- TODO: comment reactions display -->
          </article>
        </div>

        <!-- Go back -->
        <br />
        <br />
        <button
          type="button"
          (click)="goBack()"
          class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <<
        </button>
      </div>
    </section>
  `,
  styles: [],
})
export class QuestionComponent {
  private courseService = inject(CoursesService);
  private stateService = inject(StateService);
  private notification = inject(ToastrService);
  private _activatedRoute = inject(ActivatedRoute);

  course_id!: string;
  question_id!: string;
  question = {} as IQuestion;
  reactionsCount = {} as IReactionsCount;
  course = {} as ICourse;
  comments = [] as IComment[];
  state!: IState;
  is_show_answer = false;

  private router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    text: ['', Validators.required],
  });

  constructor() {
    this.course_id = this._activatedRoute.snapshot.paramMap.get(
      'course_id'
    ) as string;
    this.question_id = this._activatedRoute.snapshot.paramMap.get(
      'question_id'
    ) as string;

    this.courseService.getCourseById(this.course_id).subscribe((response) => {
      if (response.success) {
        this.course = response.data;
      }
    });

    this.courseService
      .getQuestionById(this.course_id, this.question_id)
      .subscribe((response) => {
        if (response.success) {
          this.question = response.data;
          if (this.question.comments.length > 0) {
            this.comments = this.question.comments;
          }
        }
      });

    this.courseService
      .getQuestionReactionsCount(this.course_id, this.question_id)
      .subscribe((response) => {
        if (response.success) {
          this.reactionsCount = response.data;
        }
      });

    this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  submit() {
    this.courseService
      .addComment(this.course_id, this.question_id, this.form.value as IComment)
      .subscribe((response) => {
        if (response.success) {
          this.form.get('text')?.reset();

          this.notification.success('Successfully added comment!');

          this.courseService
            .getQuestionById(this.course_id, this.question_id)
            .subscribe((response) => {
              if (response.success) {
                this.question = response.data;
                if (this.question.comments.length > 0) {
                  this.comments = this.question.comments;
                }
              }
            });
        }
      });
  }

  removeComment(comment_id: string) {
    this.courseService
      .removeComment(this.course_id, this.question_id, comment_id)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Successfully removed comment!');
          this.comments = this.comments.filter(
            (comment) => comment._id !== comment_id
          );
        }
      });
  }

  addReaction(reaction_type: string) {
    // if user has not reacted yet
    if (this.reactionsCount.user_reaction === null) {
      {
        this.courseService
          .addQuestionReaction(this.course_id, this.question_id, {
            type: reaction_type,
          } as IReaction)
          .subscribe((response) => {
            if (response.success) {
              this.notification.success('Successfully added reaction!');

              this.courseService
                .getQuestionReactionsCount(this.course_id, this.question_id)
                .subscribe((response) => {
                  if (response.success) {
                    this.reactionsCount = response.data;
                  }
                });
            }
          });
      }
    }

    // if user has reaction
    else {
      // reaction is the same -> remove reaction
      if (this.reactionsCount.user_reaction === reaction_type) {
        this.courseService
          .removeQuestionReactionByUserId(this.course_id, this.question_id)
          .subscribe((response) => {
            if (response.success) {
              this.notification.success('Successfully removed reaction!');

              this.courseService
                .getQuestionReactionsCount(this.course_id, this.question_id)
                .subscribe((response) => {
                  if (response.success) {
                    this.reactionsCount = response.data;
                  }
                });
            }
          });
      }

      // reaction is different -> update reaction
      else {
        this.courseService
          .updateQuestionReactionByUserId(this.course_id, this.question_id, {
            type: reaction_type,
          } as IReaction)
          .subscribe((response) => {
            if (response.success) {
              this.notification.success('Successfully updated reaction!');

              this.courseService
                .getQuestionReactionsCount(this.course_id, this.question_id)
                .subscribe((response) => {
                  if (response.success) {
                    this.reactionsCount = response.data;
                  }
                });
            }
          });
      }
    }
  }

  toggleShowAnswer() {
    this.is_show_answer = !this.is_show_answer;
  }

  goBack() {
    this.router.navigate(['', 'courses', this.course_id]);
  }
}
