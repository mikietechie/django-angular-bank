import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  // baseURL = 'http://127.0.0.1:8000/';
  baseURL = environment.APIURL + 'users/0';
  public currentUser: any;
  public isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }
  post(data, url= this.baseURL): any{
    return this.http.post(
      url,
      data,
      {headers : this.httpHeaders});
  }
  /**
   * authenticate
   * data has been changed to parameters, _id,password
   */
  public authenticate(id: any, password: string): boolean {
    return this.post({id, password})
      .subscribe(
        user => {
          if (user.id !== id || user.username === undefined || user.password !== password){
            return false;
          }else{
            this.currentUser = user;
            this.isAuthenticated = true;
            this.router.navigateByUrl('/account');
            return true;
          }
        }
      );
  }

  /**
   * logout
   */
  public logout(): void {
    this.currentUser = {};
    this.isAuthenticated = false;
    this.router.navigateByUrl('/');
  }

}
