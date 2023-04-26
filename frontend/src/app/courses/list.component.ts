import { StateService } from './../services/state.service';
import { Component, inject } from '@angular/core';
import { CoursesService, ICourse, ICoursesMeta } from './courses.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IState } from '../interfaces/state';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
        <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <!-- Title -->
          <h2
            class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            Compro Quiz Hub
          </h2>

          <!-- Description -->
          <p
            class="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400"
          >
            Practice and prepare for Compro courses efficiently. Also, please
            add your own courses and questions.
          </p>
        </div>

        <!-- Filter Dropdown -->
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="course_code"></label>
            <select
              formControlName="course_code"
              class="form-control"
              (change)="changeCourseCode($event)"
            >
              <option>All</option>
              <option *ngFor="let web of coursesMeta.course_codes">
                {{ web }}
              </option>
            </select>
          </div>
        </form>

        <!-- Course List -->
        <br />
        <br />
        <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
          <div *ngFor="let course of courses">
            <div
              class="items-center bg-green-50 rounded-lg shadow sm:flex dark:bg-green-800 dark:border-green-700"
            >
              <div class="p-5">
                <!-- title link -->
                <h3
                  class="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                  <a [routerLink]="['', 'courses', course._id]">
                    {{ course.course_code }}: {{ course.title }}</a
                  >
                </h3>

                <!-- instructor-->
                <p
                  class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400"
                >
                  Instructor: {{ course.instructor || 'Anonymous' }}
                </p>

                <!-- term -->
                <p
                  class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400"
                >
                  Term: {{ course.term | date : 'mediumDate' || 'Unknown' }}
                </p>

                <!-- added by -->
                <p
                  class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400"
                >
                  Added by: {{ course.user.name || 'Anonymous' }}
                </p>

                <!-- questions -->
                <ul class="flex space-x-4 sm:mt-0">
                  <li>Questions ({{ course.questions.length }})</li>
                </ul>

                <!-- edit course button -->
                <br />
                <button
                  *ngIf="state._id == course.user._id"
                  (click)="goToEdit(course._id)"
                  type="button"
                  class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Edit
                </button>

                &nbsp;
                <!-- remove course button -->
                <button
                  *ngIf="state._id == course.user._id"
                  (click)="removeCourse(course._id)"
                  type="button"
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          (click)="goToAdd()"
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Add a New Course?
        </button>

        <!-- Pagination -->
        <br />
        <br />
        <nav *ngIf="courses.length > 0" aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <button
                type="button"
                (click)="getCourses(current_page - 1, course_code)"
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
                (click)="getCourses(page, course_code)"
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
                (click)="getCourses(current_page + 1, course_code)"
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
      </div>
    </section>
  `,
  styles: [],
})
export class ListComponent {
  private courseService = inject(CoursesService);
  private stateService = inject(StateService);
  private router = inject(Router);
  private notification = inject(ToastrService);

  coursesMeta = {} as ICoursesMeta;
  courses = [] as ICourse[];
  state!: IState;

  page_size = 4;
  current_page = 1;
  course_code = '';
  courses_count = 0;

  form = new FormGroup({
    course_code: new FormControl('', Validators.required),
  });

  constructor() {
    this.courseService
      .getCoursesMeta(this.course_code)
      .subscribe((response) => {
        if (response.success) {
          this.coursesMeta = response.data;
          this.courses_count = this.coursesMeta.courses_count;
        }
      });

    this.courseService
      .getCourses(this.current_page, this.page_size, this.course_code)
      .subscribe((response) => {
        if (response.success) {
          this.courses = response.data;
        }
      });

    this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  goToAdd() {
    this.router.navigate(['', 'courses', 'add']);
  }

  goToEdit(course_id: string) {
    this.router.navigate(['', 'courses', 'update', course_id]);
  }

  removeCourse(course_id: string) {
    this.courseService.removeCourse(course_id).subscribe((response) => {
      if (response.success) {
        this.notification.success('Course removed');
        console.log(response);
        this.courses = this.courses.filter((c) => c._id !== course_id);
      }
    });

    this.courseService
      .getCoursesMeta(this.course_code)
      .subscribe((response) => {
        if (response.success) {
          this.courses_count = response.data.courses_count;
        }
      });
    this.current_page = 1;
    this.getCourses(this.current_page, this.course_code);
  }

  getPages() {
    const pages = [];
    const totalPages = Math.ceil(this.courses_count / this.page_size);
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getCourses(page_number: number, course_code: string) {
    this.course_code = course_code;
    if (page_number < 1 || page_number > this.getPages().length) return;
    this.current_page = page_number;

    this.courseService
      .getCourses(page_number, this.page_size, this.course_code)
      .subscribe((response) => {
        if (response.success) {
          this.courses = response.data;
        }
      });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
  }

  changeCourseCode(e: any) {
    console.log(e.target.value);
    if (e.target.value === 'All') {
      this.course_code = '';
    } else {
      this.course_code = e.target.value;
    }
    this.current_page = 1;

    this.courseService
      .getCoursesMeta(this.course_code)
      .subscribe((response) => {
        if (response.success) {
          this.courses_count = response.data.courses_count;
        }
      });

    this.getCourses(this.current_page, this.course_code);
  }
}
