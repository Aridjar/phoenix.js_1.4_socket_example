import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { Timer } from '../model/timer';
import { Container } from '../model/container';
import { BehaviorSubject } from 'rxjs/behaviorsubject';

@Injectable()
export class TimerService {
  private containers_data: Container[] = [
    {id: 1, name: 'first_container', subscribed: false, message: undefined, listener: undefined, sub: undefined},
    {id: 2, name: 'second_container', subscribed: false, message: undefined, listener: undefined, sub: undefined},
    {id: 3, name: 'third_container', subscribed: false, message: undefined, listener: undefined, sub: undefined},
    {id: 4, name: 'fourth_container', subscribed: false, message: undefined, listener: undefined, sub: undefined},
    {id: 5, name: 'fifth_container', subscribed: false, message: undefined, listener: undefined, sub: undefined},
  ];
  private ContainerSources = new BehaviorSubject<Container[]>(
    this.containers_data
  );
  private ContainerSource = new BehaviorSubject<Container>(undefined);

  public containers$: Observable<Container[]> = this.ContainerSources.asObservable();
  public container$: Observable<Container> = this.ContainerSource.asObservable();

  constructor() {
    // this.containers$.subscribe(
    //   data => {
    //     console.log(data);
    // });
    //
    // this.container$.subscribe(
    //   data => {
    //     console.log(data);
    // });
  }

  public get_containers(): Container[] {
    return this.containers_data;
  }

  public get_container_by_id(id: number): Container {
    return this.containers_data.find((x) => x.id === id);
  }

  public update_container_by_id(container: Container): void {
    const index = this.containers_data.findIndex((e) => e.id === container.id);

    if (index === -1) {
      this.containers_data.push(container);
    } else {
      this.containers_data[index] = container;
    }

    this.ContainerSources.next(this.containers_data);
  }

  public update_active_container(container: Container): void {
    this.ContainerSource.next(container);
    this.update_container_by_id(container);
  }

  public listen_channel(container: Container, timer: Observable<Timer>): void {
    container.subscribed = true;
    container.listener = timer;

    container.sub = timer.subscribe(
      data => {
        container.message = {response: data.response, counter: data.time};
        this.update_container_by_id(container);
      }
    );

    this.update_active_container(container);
  }

  public unlisten_channel(container: Container): void {
    container.sub.unsubscribe();
    container.subscribed = false;
    container.listener = undefined;

    this.update_active_container(container);
  }
}
