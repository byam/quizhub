import { Component, inject } from '@angular/core';
import { IState, intial_state } from '../interfaces/state';
import { Subscription } from 'rxjs';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <nav
        class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800"
      >
        <div
          class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl"
        >
          <span
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >Welcome {{ state.name }} !
          </span>

          <div *ngIf="!state._id" class="flex items-center lg:order-2">
            <a
              [routerLink]="['', 'signin']"
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >Log in</a
            >
            <a
              [routerLink]="['', 'signup']"
              class="text-gray bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >Get started</a
            >
          </div>

          <div *ngIf="state._id" class="flex items-center lg:order-2">
            <button
              (click)="signOut()"
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log Out
            </button>
          </div>

          <div
            class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul
              class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
            >
              <li>
                <a
                  [routerLink]="['', 'courses']"
                  class="block py-2 pr-4 pl-3 text-gray rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                  >Home</a
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  state!: IState;

  private subscription!: Subscription;
  private stateService = inject(StateService);
  private router = inject(Router);

  constructor() {
    this.subscription = this.stateService
      .getState()
      .subscribe((state) => (this.state = state));
  }

  goToSignIn() {
    this.router.navigate(['', 'signin']);
  }

  goToSignUp() {
    this.router.navigate(['', 'signup']);
  }

  signOut() {
    this.stateService.setState(intial_state);
    localStorage.clear();
    this.router.navigate(['', 'signin']);
  }
}
