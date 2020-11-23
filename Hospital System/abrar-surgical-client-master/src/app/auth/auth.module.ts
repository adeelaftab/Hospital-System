import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { RouterModule } from '@angular/router';
import { UIModule } from '../ui/ui.module';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UIModule,
    LayoutModule
  ]
})
export class AuthModule { }
