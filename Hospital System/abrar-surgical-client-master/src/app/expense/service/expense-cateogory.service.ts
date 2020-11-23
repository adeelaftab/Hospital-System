import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExpenseCateogoryService {

  uri = environment.serverURL+'/expense-category';

   

  constructor(private http: HttpClient) {
    
   }

  create(formData)
  {
	  return this.http.post<any>(this.uri+'/create',formData);
  }

  update(_id,formData)
  {
	  return this.http.post<any>(this.uri+'/update/'+_id,formData);
  }


  //Find All Records

  getAll()
  {
   
    return this.http.get<any>(this.uri+'/');
  }

  getActive()
  {
    return this.http.get<any>(this.uri+'/active');
  }


}