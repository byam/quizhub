import { Component, inject } from '@angular/core';
import { CoursesService, ICourse } from './courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update',
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Edit Course
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

            <!-- course term #TODO: Date pick -->
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
          <!-- add margin -->
          <br />
          <div class="sm:col-span-2">
            <button
              type="submit"
              [disabled]="!form.valid"
              class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Update
            </button>
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
        </form>
      </div>
    </section>
  `,
  styles: [],
})
export class UpdateComponent {
  private courseService = inject(CoursesService);

  private router = inject(Router);
  private notification = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  form = inject(FormBuilder).nonNullable.group({
    _id: [''],
    course_code: ['', Validators.required],
    title: ['', Validators.required],
    instructor: ['', Validators.required],
    description: ['', Validators.required],
    term: ['', Validators.required],
  });

  constructor() {
    const course_id = this.activatedRoute.snapshot.paramMap.get('course_id');
    if (course_id) {
      this.courseService.getCourseById(course_id).subscribe((response) => {
        if (response.success) {
          const { _id, course_code, title, instructor, description, term } =
            response.data;
          this.form.get('_id')?.patchValue(_id);
          this.form.get('course_code')?.patchValue(course_code);
          this.form.get('title')?.patchValue(title);
          this.form.get('instructor')?.patchValue(instructor);
          this.form.get('description')?.patchValue(description);
          this.form.get('term')?.patchValue(term.slice(0, 10));
        }
      });
    }
  }

  submit() {
    this.courseService
      .updateCourse(this.form.value as ICourse)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Successfully updated course!');
          this.router.navigate(['', 'courses']);
        }
      });
  }

  goBack() {
    //works!
    this.router.navigate(['', 'courses']);
  }
}

// naming suggestion
//edit-course
