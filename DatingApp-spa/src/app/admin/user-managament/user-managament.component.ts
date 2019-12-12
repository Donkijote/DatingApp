import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-managament',
  templateUrl: './user-managament.component.html',
  styleUrls: ['./user-managament.component.css']
})
export class UserManagamentComponent implements OnInit {
  users: User[];
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      error => {
        console.log(error);
      }
    );
  }
}
