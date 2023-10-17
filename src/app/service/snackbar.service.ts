import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackBarType = 'error' | 'success' | 'warning' ;

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar, private zone: NgZone) { }

  show(message: string, type: SnackBarType): void {
    this.zone.run(() => {
      this.snackbar.open(
        message,
        'x',
        { panelClass: ['snackbar-container', type] },
      );
    });
  }
}