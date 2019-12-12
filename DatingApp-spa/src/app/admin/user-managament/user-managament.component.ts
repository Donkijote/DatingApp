import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RoleModalComponent } from '../role-modal/role-modal.component';

@Component({
  selector: 'app-user-managament',
  templateUrl: './user-managament.component.html',
  styleUrls: ['./user-managament.component.css']
})
export class UserManagamentComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

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

  editRoleModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RoleModalComponent, {
      initialState
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.role;
    const availableRoles: any[] = [
      {
        name: 'Admin',
        value: 'Admin'
      },
      {
        name: 'Moderator',
        value: 'Moderator'
      },
      {
        name: 'Member',
        value: 'Member'
      },
      {
        name: 'VIP',
        value: 'VIP'
      }
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
