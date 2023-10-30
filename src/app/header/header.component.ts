import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(){}

  ngOnInit(): void {
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      // Toggle the sidenav when the menu button is clicked
      this.sidenav.toggle();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      // Unsubscribe from the subscription when the component is destroyed to avoid memory leak
      this.subscription.unsubscribe();
    }
  }
}
