import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../shared/services/timer.service';
import { SocketService } from '../../shared/services/socket.service';
import { Container } from '../../shared/model/container';

@Component({
  selector: 'app-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.css']
})
export class TimersComponent implements OnInit {
  containers: Container[];

  constructor(
    private timer_service: TimerService,
    private socket_service: SocketService
  ) {
    timer_service.containers$.subscribe(
      data => {
        this.containers = data;
      }
    );
  }

  ngOnInit() {
  }

  select_container(container: Container) {
    this.timer_service.update_active_container(container);
  }
}
