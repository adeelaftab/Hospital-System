import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { RoomTypeComponent } from './room-type/room-type.component';
import { ModalRoomTypeComponent } from './modal/room-type/room-type.component';
import { ModalRoomComponent } from './modal/room/room.component';
import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoomComponent, RoomTypeComponent,ModalRoomTypeComponent,ModalRoomComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UIModule
  ],
  entryComponents: [
    ModalRoomTypeComponent,
    ModalRoomComponent
  ]
})
export class RoomManagnmentModule { }
