import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '../_services/alerts.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private alert: AlertsService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const key = 'messages';
      this.messages = data[key];
      this.pagination = data[key].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessages(
        this.auth.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        err => {
          this.alert.error(err);
        }
      );
  }

  deleteMessage(id: number) {
    this.alert.confirm('Are you sure you want to delete this message', () => {
      this.userService
        .deleteMessage(id, this.auth.decodedToken.nameid)
        .subscribe(
          () => {
            this.messages.splice(
              this.messages.findIndex(m => m.id === id),
              1
            );
            this.alert.success('Message has been deleted');
          },
          err => {
            this.alert.error('Faild to delete the message');
          }
        );
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
