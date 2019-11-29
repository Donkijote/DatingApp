import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertsService } from 'src/app/_services/alerts.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private alert: AlertsService
  ) {}

  ngOnInit() {
    console.log(this.messages);
    this.loadMessages();
  }

  loadMessages() {
    this.userService
      .getMessageThread(this.auth.decodedToken.nameid, this.recipientId)
      .subscribe(
        resp => {
          this.messages = resp;
        },
        err => {
          this.alert.error(err);
        }
      );
  }
}
