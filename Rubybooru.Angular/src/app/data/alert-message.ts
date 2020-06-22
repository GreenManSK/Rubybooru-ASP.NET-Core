import { AlertType } from './alert-type';

export class AlertMessage {
  message: string;
  type: AlertType;


  constructor( message: string, type: AlertType ) {
    this.message = message;
    this.type = type;
  }
}
