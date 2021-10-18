import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  // baseURL = 'http://127.0.0.1:8000/';
  baseURL = environment.APIURL;

  constructor(private http: HttpClient) { }


  get(url= this.baseURL): Observable<any>{
    return this.http.get(
      url,
      {headers: this.httpHeaders}
    );
  }
  one(id: string, url= this.baseURL): any{
    return this.http.get(url + id,
    {headers: this.httpHeaders});
  }
  post(data, url= this.baseURL): any{
    return this.http.post(
      url,
      data,
      {headers : this.httpHeaders});
  }
  put(id: string, data, url= this.baseURL): any{
    return this.http.put(
      url + id,
      data,
      {headers : this.httpHeaders});
  }
  delete(id: string, url= this.baseURL): any{
    return this.http.delete(
      url + id,
      {headers : this.httpHeaders});
  }

}
