import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertsService } from '../_services/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertsService
  ) {}
  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }

    this.alert.error('You shall not pass!!!');
    this.router.navigate(['/home']);
    return false;
  }
}
