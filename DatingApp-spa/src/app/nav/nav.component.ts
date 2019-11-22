import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertsService } from '../_services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  constructor(
    public authService: AuthService,
    private alert: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(resp => (this.photoUrl = resp));
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alert.success('Logged in successfully');
      },
      error => {
        this.alert.error(error);
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alert.message('logged out');
    this.router.navigate(['/home']);
  }
}
