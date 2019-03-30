import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../shared/services/timer.service';
import { SocketService } from '../../shared/services/socket.service';
import { Container } from '../../shared/model/container';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  container: Container;

  constructor(
    private timer_service: TimerService,
    private socket_service: SocketService
  ) {
    timer_service.container$.subscribe(
      data => {
        this.container = data;
      }
    );
  }

  ngOnInit() {
  }

  subscribe(name: string): void {
    const timer = this.socket_service.join('timer:' + name, {}, true);
    this.timer_service.listen_channel(this.container, timer);
  }

  unsubscribe(name: string): void {
    this.socket_service.close_channel('timer:' + name);
    this.timer_service.unlisten_channel(this.container);
  }

  stop(name: string): void {
    this.socket_service.stop_channel('timer:' + name);
    this.unsubscribe(name);
  }
}
