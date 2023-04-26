import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app.component';
import { SigninComponent } from './components/signin.component';
import { SignupComponent } from './components/signup.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { StateService } from './services/state.service';
import { AddTokenInterceptor } from './add-token.interceptor';

function bootstrap(stateService: StateService) {
  return () => {
    const persistedState = localStorage.getItem('APP_STATE');
    if (persistedState) {
      stateService.setState(JSON.parse(persistedState));
    }
  };
}

@NgModule({
  declarations: [AppComponent, SigninComponent, SignupComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,

    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'signin' },
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },

      // Lazy loading for courses module, when the user navigates to "/courses"
      {
        path: 'courses',
        loadChildren: () =>
          import('./courses/courses.module').then((m) => m.CoursesModule),
        canActivate: [() => inject(StateService).isLoggedIn()],
      },

      { path: '**', redirectTo: 'signin' },
    ]),
    HttpClientModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrap,
      deps: [StateService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AddTokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
