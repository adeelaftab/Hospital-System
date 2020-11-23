import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  uri = environment.serverURL+'/payment';

   

  constructor(private http: HttpClient) {
    
   }

  create(formData)
  {
	  return this.http.post<any>(this.uri+'/create',formData);
  }

  viewInvoicePayment(id)
  {
	  return this.http.get<any>(this.uri+'/invoice/'+id);
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

  viewDetail(_id)
  {
    return this.http.get<any>(this.uri+'/'+_id);
  }

  viewCharges(id){
    return this.http.get<any>(this.uri+'/charges/'+id);
  }

}