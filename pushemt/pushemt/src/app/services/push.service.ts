import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: any[] = [
    {
      title: 'Titulo de la push',
      body: 'Este es el body de la push',
      date: new Date()
    }
  ]

  constructor(private oneSignal: OneSignal) { }

  configuracionInicial() {
    this.oneSignal.startInit('67764914-16d4-42e2-b878-b63dbb36f611', '769006050872');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
      // do something when notification is received
      console.log('notificacion recibida', noti);
      this.notificacionRecibida( noti );

    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('notificacion abierta', noti);

    });

    this.oneSignal.endInit();
  }
  notificacionRecibida(noti: OSNotification) {
    const payload = noti.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID)
    if (existePush){
      return;
    }
    this.mensajes.unshift(payload)
  }
}
