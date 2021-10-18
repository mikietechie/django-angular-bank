import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private router: Router, private dialog: MatDialog, public authService: AuthService) { }

  ngOnInit(): void {
    this.checkIsAuthenticated();
    $(() => {$(document).trigger('click'); });  // this is temporarily done to close login dialog component
  }
  openUpdateProfileDialog(): void {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {data: this.authService.currentUser});
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
      }
    );
  }
  checkIsAuthenticated(): void {
    if (!this.authService.isAuthenticated){
      this.router.navigateByUrl('/');
    }
  }
}
