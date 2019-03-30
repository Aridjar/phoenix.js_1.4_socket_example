import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';
import { Timer } from './timer';

export interface Container {
  id: number;
  name: string;
  subscribed: boolean;
  message: any;
  listener: Observable<Timer>;
  sub: Subscription;
}
