import { Routes } from '@angular/router';
import { WelcomeContentComponent } from './welcome-content/welcome-content.component';
import { LoggedInContentComponent } from './logged-in-content/logged-in-content.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { SearchContentComponent } from './search-content/search-content.component';

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
    path: 'user-info/:userName',
    component: UserInfoComponent,
  },
  {
    path: 'search',
    component: SearchContentComponent,
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
];
