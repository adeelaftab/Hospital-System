import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})




export class HelperService {

  uri = environment.serverURL+'/helper';

   

  constructor(private http: HttpClient) {
    
   }



  send(number,message)
  {
	  let formData = {
		  number : number,
		  message : message
	  }
	  return this.http.post<any>(this.uri+'/sms',formData);
  }

  apiPush(_id,formData){
    return this.http.post<any>(this.uri+'/diagPush/'+_id,formData);
  }

  dashboard(){
    return this.http.get<any>(this.uri+'/dashboard/');
  }


}