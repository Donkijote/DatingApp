import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from 'src/app/_services/alerts.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  user: User;
  constructor(private route: ActivatedRoute, private alert: AlertsService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const key = 'user';
      this.user = data[key];
    });
  }

  updateUser() {
    console.log(this.user);
    this.alert.success('Profile updated successfully');
    this.editForm.reset(this.user);
  }
}
