import { Component, inject } from '@angular/core';
import { CoursesService, IQuestion } from './courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-question',
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Update a question
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <!-- question -->
            <div class="sm:col-span-2">
              <label
                for="text"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Question</label
              >
              <textarea
                placeholder="text"
                formControlName="text"
                id="text"
                rows="8"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              ></textarea>
            </div>

            <!-- choices -->
            <div class="sm:col-span-2">
              <label>
                <!-- Answers -->
                <div
                  *ngFor="
                    let choice of form.controls.choices.controls;
                    let i = index
                  "
                  class="sm:col-span-2"
                >
                  <br />
                  <label
                    class="block mb-2 text-sm font-small text-gray-900 dark:text-white"
                    >Answer {{ i + 1 }}</label
                  >
                  <input
                    [formControl]="choice"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <br />
                  <span
                    (click)="removeInputControl(i)"
                    class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-small rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Remove
                  </span>
                </div>
                <br />
                <span
                  (click)="addInputControl()"
                  class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-small rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                >
                  Add More Answer?
                </span>
              </label>
            </div>

            <!-- correctIndex -->
            <br />
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <label
                for="correctIndex"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Correct Answer Number</label
              >
              <input
                placeholder="correctIndex"
                formControlName="correctIndex"
                type="number"
                name="correctIndex"
                id="correctIndex"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required=""
              />
            </div>
          </div>

          <!-- explanation -->
          <div class="sm:col-span-2">
            <label
              for="title"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Answer Explanation</label
            >
            <input
              placeholder="explanation"
              formControlName="explanation"
              type="text"
              name="explanation"
              id="explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required=""
            />
          </div>

          <!-- button -->
          <!-- add margin -->
          <br />
          <div class="sm:col-span-2">
            <button
              type="button"
              style="margin-left: 30px;"
              (click)="goBack()"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <<
            </button>
            <button
              type="submit"
              [disabled]="!form.valid"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Update Question
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [],
})
export class UpdateQuestionComponent {
  private courseService = inject(CoursesService);

  private router = inject(Router);
  private notification = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private FormBuilder = inject(FormBuilder);

  course_id!: string;
  question_id!: string;

  form = inject(FormBuilder).nonNullable.group({
    _id: [''],
    text: ['', Validators.required],
    explanation: ['', Validators.required],
    choices: this.FormBuilder.array([]),
    correctIndex: [1, Validators.required],
  });

  constructor() {
    this.course_id = this.activatedRoute.snapshot.paramMap.get(
      'course_id'
    ) as string;
    this.question_id = this.activatedRoute.snapshot.paramMap.get(
      'question_id'
    ) as string;

    if (this.course_id && this.question_id) {
      this.courseService
        .getQuestionById(this.course_id, this.question_id)
        .subscribe((response) => {
          if (response.success) {
            console.log(response.data);
            const { _id, text, explanation, choices, correctIndex } =
              response.data;
            this.form.get('_id')?.patchValue(_id);
            this.form.get('text')?.patchValue(text);
            this.form.get('explanation')?.patchValue(explanation);

            // this.form.get('choices')?.patchValue(choices);
            choices.forEach((choice: string) => {
              this.form.controls.choices.push(new FormControl(choice));
            });

            this.form.get('correctIndex')?.patchValue(correctIndex);
          }
        });
    }
  }

  addInputControl() {
    this.form.controls.choices.push(new FormControl('', Validators.required));
  }

  removeInputControl(index: number) {
    this.form.controls.choices.removeAt(index);
  }

  submit() {
    console.log(this.course_id);
    console.log(this.form.value);
    this.courseService
      .updateQuestion(this.course_id, this.form.value as IQuestion)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Successfully update question!');
          this.router.navigate(['', 'courses', this.course_id]);
        }
      });
  }
  goBack() {
    this.router.navigate(['', 'courses', this.course_id]);
  }
}
