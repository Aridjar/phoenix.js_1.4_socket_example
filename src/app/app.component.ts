import { Component } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { SocketService } from './shared/services/socket.service';
import { Timer } from './shared/model/timer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: String = 'app';
  counter: String = '0';

  public timer: Observable<Timer>;
  public response: string;
  public time: string;

  constructor(socket: SocketService) {
    this.timer = socket.join('timer:auto');

    this.timer.subscribe(
      data => {
        this.response = data.response;
        this.counter = data.time;
        console.log(data);
      }
    );
  }
}
