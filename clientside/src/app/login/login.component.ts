import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showSpinner = false;


  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        id: new FormControl('', [Validators.required, Validators.min(1)]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)])
      }
    );
  }
  /*
  openSnackBar(): void {
    this.snackBar.open('Incorrect login credentials', 'dismiss');
  }*/

  login(): void {
    /*this.showSpinner = true;
    setTimeout(
      ( ) => {
        if (this.authService.authenticate(this.loginForm.value.id, this.loginForm.value.password)){
          this.showSpinner = false;
          this.loginForm.reset();
          this.router.navigateByUrl('/account');
        }else {
          // this.openSnackBar();
          this.loginForm.reset();
        }
      }, 3000
    );
    */
   /*
    if (this.authService.authenticate(this.loginForm.value.id, this.loginForm.value.password)){
      this.showSpinner = true;
      // this.openSnackBar();
      setTimeout(() => {
        this.showSpinner = false;
        this.openSnackBar();
      }, 3000);
      this.loginForm.reset();
    }else{
      // this.openSnackBar();
      return;
    }*/
    this.authService.authenticate(this.loginForm.value.id, this.loginForm.value.password);
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 3000);
    this.loginForm.reset();
    return;
  }
}
