import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public currentUser: any,
    public authService: AuthService,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeUpdateForm();
  }
  //  method to initialise make new transaction form
  initializeUpdateForm(): void {
    this.updateForm = this.formBuilder.group(
      {
        id: new FormControl('', [Validators.required, Validators.min(0)]),
        currentPassword: new FormControl('', [Validators.required,  Validators.minLength(4)]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
        newEmail: new FormControl('', [Validators.required, Validators.minLength(4), Validators.email])
      }
    );
  }
  // method to make a transaction call to the server
  onUpdate(): void {
    if (
      this.updateForm.value.currentPassword !== this.authService.currentUser.password
      || this.updateForm.value.id !== this.authService.currentUser.id
    ){
      this.openSnackBar(`Incorrect password or account number you will now be redirected to login page!!!`);
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 2000);
      return;
    }
    if (
      this.updateForm.value.newPassword !== this.updateForm.value.confirmPassword
    ){
      this.openSnackBar(`Password confirmation test failed`);
      return;
    }
    if (
      confirm(`Are you sure you want to update your details?`)
      ){
        this.itemService.put(`${this.authService.currentUser.id}`,
          {
            id: this.authService.currentUser.id,
            oldPassword: this.authService.currentUser.password,
            password: this.updateForm.value.newPassword,
            email: this.updateForm.value.newEmail
          },
          this.itemService.baseURL + `users/`)
          .subscribe(
            data => {
              if (data.id !== undefined) {
                this.openSnackBar(`
                Successfully updated!!!
                `);
                this.authService.authenticate(data.id, data.password);
              } else {
                this.openSnackBar(`Updates failed retry!!!`);
              }

            }
        );
    }
    return;
  }


  //  method to  open a snackbar
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'dismiss');
  }
}
