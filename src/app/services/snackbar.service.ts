import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  message = signal<string | null>(null);

  show(msg: string) {
    this.message.set(msg);

    setTimeout(() => this.message.set(null), 1000);
  }

  handleError(err: any) {
    const isAppException =
      err.status >= 400 &&
      err.status < 500 &&
      typeof err.error?.message === 'string';
  
    if (isAppException) {
      this.show(err.error.message);
    } else {
      this.show('Something went wrong.');
    }
  }
}
