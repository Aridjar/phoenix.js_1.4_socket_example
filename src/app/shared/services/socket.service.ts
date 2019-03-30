import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'phoenix';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Timer } from '../model/timer';

const TIMER_URL = 'ws://localhost:4001/socket';

@Injectable()
export class SocketService implements OnDestroy {
  socket: Socket = new Socket(TIMER_URL, {params: {token: null}});
  channels: {channel_listener: Observable<Timer>, channel_content: Subject<Timer>, channel_entity: any}[] = [];

  constructor() {
    this.socket.connect();
  }

  ngOnDestroy(): void {
    this.closeAll();
  }

  public join(channel_name: string, opts: {} = {}, push: boolean = false): Observable<Timer> {
    const channel_entity: any = this.socket.channel(channel_name, opts);
    const channel_content: Subject<Timer> = this.create_observable();
    const channel_listener: Observable<Timer> = channel_content.asObservable();

    channel_entity.join()
      .receive('ok', resp => {console.log('joined ' + channel_name + ' successfully', resp); })
      .receive('error', resp => {console.log('unable to join' + channel_name, resp); });

    if (push) {
      channel_entity.push('start_timer', {channel_name: channel_name.split(':')[1]})
        .receive('ok', resp => { console.log('Started timer', resp); });
    }

    channel_entity.on('updated_time',
      msg => {
        channel_content.next(msg);
      }, err => {
        console.log('Error !!', err);
        // this.close(channel_name);
        // this.join(channel_name, opts);
      }
    );

    this.channels[channel_name] = {
      channel_entity: channel_entity,
      channel_content: channel_content,
      channel_listener: channel_listener
    };

    return channel_listener;
  }

  public close_channel(channel_name: string): void {
    this.close_nammed_channel(this.channels[channel_name]);
  }

  public stop_channel(channel_name: string): void {
    this.channels[channel_name].channel_entity.push('stop_timer', {channel_name: channel_name.split(':')[1]})
      .receive('ok', resp => { console.log('Started timer', resp); });
  }

  private close_nammed_channel(chan): void {
    chan.channel_entity.leave();
    chan.channel_content.unsubscribe();
}

  private closeAll(): void {
    this.channels.forEach(this.close_nammed_channel);
  }

  private create_observable(): Subject<Timer> {
    const channel_content = new Subject<Timer>();

    return channel_content;
  }
}
