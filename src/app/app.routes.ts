import { Routes } from '@angular/router';
import { WelcomeContentComponent } from './welcome-content/welcome-content.component';
import { LoggedInContentComponent } from './logged-in-content/logged-in-content.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeContentComponent,
  },
  {
    path: 'user/:userName',
    component: LoggedInContentComponent,
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
];
