import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from './services/socket.service';
import { TimerService } from './services/timer.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [SocketService, TimerService]
})
export class SharedModule { }
