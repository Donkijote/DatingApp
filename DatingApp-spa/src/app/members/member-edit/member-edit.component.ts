import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from 'src/app/_services/alerts.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private alert: AlertsService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const key = 'user';
      this.user = data[key];
    });
    this.authService.currentPhotoUrl.subscribe(resp => (this.photoUrl = resp));
  }

  updateUser() {
    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        next => {
          this.alert.success('Profile updated successfully');
          this.editForm.reset(this.user);
        },
        error => {
          this.alert.error(error);
        }
      );
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
