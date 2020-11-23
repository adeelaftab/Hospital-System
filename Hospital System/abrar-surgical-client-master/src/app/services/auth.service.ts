import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = environment.serverURL+'/auth';

  constructor(private _http: HttpClient,
    private helper :JwtHelperService

    
    ) { }

  login(body:any){
    return this._http.post<any>(this.uri+'/login', body,{
      observe:'body'
    });
  }


  isAuthenticated(): boolean {
    console.log(localStorage.getItem('access_token'));
    return localStorage.getItem('access_token') != null && !this.isTokenExpired();
  }


  isTokenExpired(): boolean {
    return this.helper.isTokenExpired(localStorage.getItem('access_token'));
   
  
  }

  
}
