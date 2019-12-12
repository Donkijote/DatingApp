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

  editRoleModal() {
    const initialState = {
      list: [
        'Open a modal with component',
        'Pass your data',
        'Do something else',
        '...'
      ],
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(RoleModalComponent, {
      initialState
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
