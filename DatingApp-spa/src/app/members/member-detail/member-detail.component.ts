import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertsService } from 'src/app/_services/alerts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  constructor(
    private userService: UserService,
    private alert: AlertsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const key = 'user';
      this.user = data[key];
    });
  }

  /*loadUser() {
    const key = 'id';
    this.userService.getUser(+this.route.snapshot.params[key]).subscribe(
      (user: User) => {
        this.user = user;
      },
      error => {
        this.alert.error(error);
      }
    );
  }*/
}
