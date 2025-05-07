import { Routes } from '@angular/router';
import { WelcomeContentComponent } from './welcome-content/welcome-content.component';
import { LoggedInContentComponent } from './logged-in-content/logged-in-content.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { SearchContentComponent } from './search-content/search-content.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeContentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:userName',
    component: LoggedInContentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-info/:userName',
    component: UserInfoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search',
    component: SearchContentComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
];
