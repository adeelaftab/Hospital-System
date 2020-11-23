import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  respData : any[];

  constructor(
    private _myservice: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder) { 
      this.respData = [];
    }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]

    });
  }

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login() {
    console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      this._myservice.login(this.loginForm.value)
        .subscribe(
          response => {
            console.log(response);
            this.respData  = response;
            this.toastr.success('Login Successfully','');

            localStorage.setItem('access_token',response.token);
            this._router.navigate(['vertical/dashboard']);
          },
          error => { 
            console.log(error);
            this.toastr.error('Authentication Failed', error.error.message);

          }
        );
    }
  }
}
