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
  constructor(
    public authService: AuthService,
    private alert: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {}

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
    this.alert.message('logged out');
    this.router.navigate(['/home']);
  }
}
