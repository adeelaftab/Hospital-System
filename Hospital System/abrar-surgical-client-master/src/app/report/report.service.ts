import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})




export class ReportService {

  uri = environment.serverURL+'/report';

   

  constructor(private http: HttpClient) {
    
   }

 
  getDetail(form)
  {
    
    return this.http.post<any>(this.uri+'/detail',form);
  }


}