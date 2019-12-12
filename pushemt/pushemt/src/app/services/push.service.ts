import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body de la push',
    //   date: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal,
              private storage: Storage) {

    this.cargarMensajes();
  }

  async getMensajes(){
    await this.cargarMensajes();
    return[...this.mensajes];
  }
  configuracionInicial() {
    this.oneSignal.startInit('67764914-16d4-42e2-b878-b63dbb36f611', '769006050872');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
      // do something when notification is received
      console.log('notificacion recibida', noti);
      this.notificacionRecibida( noti );

    });

    this.oneSignal.handleNotificationOpened().subscribe(async(noti) => {
      // do something when a notification is opened
      console.log('notificacion abierta', noti);
      await this.notificacionRecibida( noti.notification);

    });

    // Obtener ID del suscriptor
    this.oneSignal.getIds().then(info => {
      this.userId = info.userId;
      console.log(this.userId);

    });

    this.oneSignal.endInit();
  }
  async notificacionRecibida(noti: OSNotification) {
    const payload = noti.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID)
    if ( existePush ) {
      return;
    }
    this.mensajes.unshift( payload );
    this.pushListener.emit( payload );
    await this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set('Alarmas', this.mensajes );
  }

  async cargarMensajes() {
    // this.storage.clear();
    this.mensajes = await this.storage.get('Alarmas') || [];
    return this.mensajes;
  }
}
