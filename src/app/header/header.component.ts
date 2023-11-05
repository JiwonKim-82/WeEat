import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { isLoggedOut } from '../auth/auth/auth.selectors';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})

export class HeaderComponent implements OnInit, OnDestroy{
  subscription: Subscription | null; // Subscription to track changes in user authentication status
  @Input() sidenav: MatSidenav | undefined;

  constructor(private store:Store){}

  ngOnInit(): void {
    this.subscription = this.store.select(isLoggedOut)
      .subscribe(isLoggedOut => {
        if (isLoggedOut) {
          this.sidenav.close();
        }
      });
  }

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
