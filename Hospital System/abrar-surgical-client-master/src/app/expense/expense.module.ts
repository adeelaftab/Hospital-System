import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseCateogoryFormComponent } from './expense-cateogory-form/expense-cateogory-form.component';
import { ExpenseCateogryListComponent } from './expense-cateogry-list/expense-cateogry-list.component';
import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExpenseFormComponent, ExpenseListComponent, ExpenseCateogoryFormComponent, ExpenseCateogryListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UIModule
  ],
  entryComponents: [
    ExpenseCateogoryFormComponent,
    ExpenseFormComponent
  ]
})
export class ExpenseModule { }
