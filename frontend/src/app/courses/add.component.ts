import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoursesService, ICourse } from './courses.service';

@Component({
  selector: 'app-add',
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new course
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <!-- course_code -->
            <div class="sm:col-span-2">
              <label
                for="course_code"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Course code</label
              >
              <input
                placeholder="course_code"
                formControlName="course_code"
                type="text"
                name="course_code"
                id="course_code"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Course code"
                required=""
              />

              <div
                *ngIf="
                  course_code.invalid &&
                  (course_code.dirty || course_code.touched)
                "
                style="color: red"
              >
                <div *ngIf="course_code.errors">
                  Length must be between 5 to 7 characters
                </div>
              </div>
            </div>

            <!-- course title -->
            <div class="sm:col-span-2">
              <label
                for="title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Course Title</label
              >
              <input
                placeholder="title"
                formControlName="title"
                type="text"
                name="title"
                id="title"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required=""
              />
            </div>

            <!-- course instructor -->
            <div class="sm:col-span-2">
              <label
                for="instructor"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Instructor</label
              >
              <input
                placeholder="instructor"
                formControlName="instructor"
                type="text"
                name="instructor"
                id="instructor"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required=""
              />
            </div>

            <!-- course term -->
            <div class="sm:col-span-2">
              <label
                for="term"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Term</label
              >
              <input
                placeholder="term"
                formControlName="term"
                type="text"
                name="term"
                id="term"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required=""
              />

              <div
                *ngIf="term.invalid && (term.dirty || term.touched)"
                style="color: red"
              >
                <div *ngIf="term.errors">Must be a valid date "YYYY-MM-DD"</div>
              </div>
            </div>

            <!-- course description -->
            <div class="sm:col-span-2">
              <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Description</label
              >
              <textarea
                placeholder="description"
                formControlName="description"
                id="description"
                rows="8"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              ></textarea>
            </div>
          </div>

          <!-- button -->
          <br />
          <div class="sm:col-span-2">
            <button
              (click)="goBack()"
              class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <<
            </button>
            <button
              type="submit"
              [disabled]="!form.valid"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [],
})
export class AddComponent {
  private courseService = inject(CoursesService);

  private router = inject(Router);
  private notification = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    course_code: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(7)],
    ],
    title: ['', Validators.required],
    instructor: ['', Validators.required],
    description: ['', Validators.required],
    term: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(
          /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
        ),
      ],
    ],
  });

  constructor() {}

  submit() {
    this.courseService
      .addCourse(this.form.value as ICourse)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Successfully added course!');
          this.router.navigate(['', 'courses']);
        }
      });
  }
  goBack() {
    this.router.navigate(['', 'courses']);
  }

  get term() {
    return this.form.get('term') as FormControl;
  }
  get course_code() {
    return this.form.get('course_code') as FormControl;
  }
}
