import { Component, inject } from '@angular/core';
import { CoursesService, ICourse, IQuestion } from './courses.service';
import { IState } from '../interfaces/state';
import { StateService } from '../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-course',
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
        <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2
            class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            {{ course.course_code }} {{ course.title }}
          </h2>
          <h3
            class="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            Questions: {{ questions.length }}
          </h3>

          <!-- description -->
          <span class="text-gray-500 dark:text-gray-400">{{
            course.description
          }}</span>

          <!-- term and questions -->
          <ul class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
            <li>Instructor: {{ course.instructor || 'Anonymous' }}</li>
            <li>Term: {{ course.term | date : 'mediumDate' || 'Unknown' }}</li>
          </ul>
        </div>

        <!-- Filter -->

        <div class="flex items-center justify-center py-4 md:py-8 flex-wrap">
          <button
            type="button"
            class="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
            (click)="questionsOrderBy('createdAt')"
          >
            Recent questions
          </button>
          <button
            type="button"
            class="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
            (click)="questionsOrderBy('reactions')"
          >
            Top Reacted questions
          </button>
          <button
            type="button"
            class="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
            (click)="questionsOrderBy('comments')"
          >
            Top Commented questions
          </button>
        </div>

        <!-- Search filter -->
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >Search</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              formControlName="text"
              type="search"
              id="default-search"
              class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search questions by keyword ..."
              required
            />
            <button
              type="submit"
              class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        <br />

        <!-- Questions -->
        <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-1">
          <div *ngFor="let question of questions">
            <div
              class="items-center bg-blue-50 rounded-lg shadow sm:flex dark:bg-blue-800 dark:border-blue-700"
            >
              <div class="p-5">
                <!-- title link -->
                <h3
                  class="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                  <a
                    [routerLink]="[
                      '',
                      'courses',
                      course_id,
                      'questions',
                      question._id
                    ]"
                  >
                    {{ question.text }}</a
                  >
                </h3>

                <p
                  class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400"
                >
                  Added by: {{ question.user.name || 'Anonymous' }}
                </p>

                <cite>
                  <ul class="flex space-x-4 sm:mt-0">
                    <li>Comments: {{ question.comments.length }}</li>
                    <!-- Show count of like and dislike -->
                    <li>Reactions: {{ question.reactions.length }}</li>
                  </ul>
                </cite>

                <p>
                  <cite class="text-sm text-gray-500 dark:text-gray-400">
                    @{{ question.createdAt | date : 'medium' || 'Unknown' }}
                  </cite>
                </p>

                <!-- edit course button -->
                <br />
                <button
                  *ngIf="state._id == question.user._id"
                  (click)="goToEdit(question._id)"
                  type="button"
                  class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Edit
                </button>

                &nbsp;
                <!-- remove course button -->
                <button
                  *ngIf="state._id == question.user._id"
                  (click)="removeQuestion(question._id)"
                  type="button"
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <br />
        <br />
        <nav *ngIf="questions.length > 0" aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <button
                type="button"
                (click)="getQuestions(current_page - 1)"
                class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Previous</span>
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>

            <!-- ngfor for questions_count by page_size-->
            <li *ngFor="let page of getPages()">
              <button
                type="button"
                (click)="getQuestions(page)"
                class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <!-- if current_page == page set bold for page -->
                <span [ngClass]="{ 'font-bold': current_page == page }">{{
                  page
                }}</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                (click)="getQuestions(current_page + 1)"
                class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Next</span>
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>

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

        <!-- Add New Question -->
        <button
          (click)="goToAdd()"
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add a New Question?
        </button>
      </div>
    </section>
  `,
  styles: [],
})
export class CourseComponent {
  private courseService = inject(CoursesService);
  private stateService = inject(StateService);
  private router = inject(Router);
  private notification = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  course_id!: string;
  course = {} as ICourse;
  questions = [] as IQuestion[];
  state!: IState;
  selectedType = 'createdAt';

  questions_count = 0;
  page_size = 3;
  current_page = 1;
  free_text = '' as string;

  form = inject(FormBuilder).nonNullable.group({
    text: ['', Validators.required],
  });

  constructor() {
    this.course_id = this.activatedRoute.snapshot.paramMap.get(
      'course_id'
    ) as string;

    this.courseService.getCourseById(this.course_id).subscribe((response) => {
      if (response.success) {
        this.course = response.data;
        this.questions_count = response.data.questions.length;
      }
    });

    this.courseService
      .getQuestionsOrderBy(
        this.course_id,
        this.selectedType,
        1,
        this.page_size,
        this.free_text
      )
      .subscribe((response) => {
        if (response.success) {
          this.questions = response.data;
        }
      });

    this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  goToAdd() {
    this.router.navigate(['', 'courses', this.course_id, 'questions', 'add']);
  }

  goToEdit(question_id: string) {
    this.router.navigate([
      '',
      'courses',
      this.course_id,
      'questions',
      'update',
      question_id,
    ]);
  }

  removeQuestion(question_id: string) {
    this.courseService
      .removeQuestion(this.course_id, question_id)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Course removed');
          this.questions = this.questions.filter((q) => q._id !== question_id);
        }
      });
  }

  questionsOrderBy(type: string) {
    this.selectedType = type;

    this.courseService
      .getQuestionsOrderBy(
        this.course_id,
        type,
        1,
        this.page_size,
        this.free_text
      )
      .subscribe((response) => {
        if (response.success) {
          this.questions = response.data;
        }
      });
  }

  getPages() {
    const pages = [];
    const totalPages = Math.ceil(this.questions_count / this.page_size);
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getQuestions(page_number: number) {
    if (page_number < 1 || page_number > this.getPages().length) return;
    this.current_page = page_number;

    this.courseService
      .getQuestionsOrderBy(
        this.course_id,
        this.selectedType,
        page_number,
        this.page_size,
        this.free_text
      )
      .subscribe((response) => {
        if (response.success) {
          this.questions = response.data;
        }
      });
  }

  goBack() {
    //this function working
    this.router.navigate(['', 'courses']);
  }

  submit() {
    this.free_text = this.form.value.text as string;
    this.courseService
      .getQuestionsOrderBy(
        this.course_id,
        this.selectedType,
        1,
        this.page_size,
        this.free_text
      )
      .subscribe((response) => {
        if (response.success) {
          this.questions = response.data;
          this.questions_count = response.data.length;
        }
      });
  }

  clearTextSearch() {
    this.free_text = '';
    this.form.reset();
    this.getQuestions(this.current_page);
  }
}
