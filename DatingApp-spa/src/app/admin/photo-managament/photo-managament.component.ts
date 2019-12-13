import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-managament',
  templateUrl: './photo-managament.component.html',
  styleUrls: ['./photo-managament.component.css']
})
export class PhotoManagamentComponent implements OnInit {
  photos: any;
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe(
      photos => {
        this.photos = photos;
      },
      err => {
        console.log(err);
      }
    );
  }

  approvePhoto(photoId) {
    this.adminService.approvePhoto(photoId).subscribe(
      () => {
        this.photos.splice(
          this.photos.findIndex(p => p.id === photoId),
          1
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  rejectPhoto(photoId) {
    this.adminService.rejectPhoto(photoId).subscribe(
      () => {
        this.photos.splice(
          this.photos.findIndex(p => p.id === photoId),
          1
        );
      },
      err => {
        console.log(err);
      }
    );
  }
}
