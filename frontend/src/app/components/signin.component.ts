import { Subscription } from 'rxjs';
import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../interfaces/user';
import { StateService } from '../services/state.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-signin',
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
              Log In
            </h1>
            <form
              class="space-y-4 md:space-y-6"
              action="#"
              [formGroup]="form"
              (ngSubmit)="signIn()"
            >
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
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>

              <button
                [disabled]="!form.valid"
                type="submit"
                class="w-full text-gray bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Log In
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Nead an account?
                <a
                  [routerLink]="['', 'signup']"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >Register here</a
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
export class SigninComponent {
  private userService = inject(UserService);
  private stateService = inject(StateService);
  private router = inject(Router);
  private notification = inject(ToastrService);
  private subscription!: Subscription;

  form = inject(FormBuilder).nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      if (state._id) {
        this.router.navigate(['', 'courses']);
      }
    });
  }

  signIn() {
    this.userService.signin(this.form.value as IUser).subscribe((response) => {
      if (response.success) {
        this.notification.success('Successfully signed in!');
        const encypted_token = response.data;
        const decoded_token = jwt_decode(encypted_token) as IUser;

        const state = {
          ...decoded_token,
          jwt: encypted_token,
        };
        this.stateService.setState(state);

        localStorage.setItem('APP_STATE', JSON.stringify(state));
        console.log(decoded_token);

        this.router.navigate(['', 'courses']); // Go to courses page after sign in
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
