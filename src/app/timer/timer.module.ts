import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimersComponent } from './timers/timers.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimersComponent, TimerComponent],
  exports: [TimersComponent, TimerComponent]
})
export class TimerModule { }
