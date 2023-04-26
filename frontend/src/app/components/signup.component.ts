import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  template: `
    <section class="bg-gray-50 dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <div
          class="w-full bg-gray rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray"
            >
              Register a MIU account
            </h1>
            <form
              class="space-y-4 md:space-y-6"
              action="#"
              [formGroup]="form"
              (ngSubmit)="signUp()"
            >
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                  >Your name</label
                >
                <input
                  formControlName="name"
                  type="text"
                  name="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your name"
                  required=""
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                  >Your email</label
                >
                <input
                  formControlName="email"
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@miu.edu"
                  required=""
                />

                <div
                  *ngIf="email.invalid && (email.dirty || email.touched)"
                  style="color: red"
                >
                  <div *ngIf="email.errors">
                    Email must be a MIU email address.
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                  >Password</label
                >
                <input
                  formControlName="password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
                <div
                  *ngIf="
                    password.invalid && (password.dirty || password.touched)
                  "
                  style="color: red"
                >
                  <div *ngIf="password.errors">Passwor minimum length 3.</div>
                </div>
              </div>
              <button
                [disabled]="!form.valid"
                type="submit"
                class="w-full text-gray bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Register an account
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?
                <a
                  [routerLink]="['', 'signin']"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >Login here</a
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class SignupComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private notification = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(/@miu\.edu$/i),
      ]),
    ],
    password: [
      '',
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
  });

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  signUp() {
    this.userService.signup(this.form.value as IUser).subscribe((response) => {
      if (response.success) {
        this.notification.success('Successfully signed up');
        this.router.navigate(['', 'signin']);
      }
    });
  }
}
