import { Component, OnInit, ApplicationRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  userEmail: string;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    public pushService: PushService,
    private applicationRef: ApplicationRef
  ) {}

  ngOnInit() {

    if (this.authService.userDetails()) {
      this.userEmail = this.authService.userDetails().email;
      this.pushService.pushListener.subscribe( noti => {
        this.mensajes.unshift( noti );
        this.applicationRef.tick();
       });

    } else {
      this.navCtrl.navigateBack('');
    }
  }

  async ionViewWillEnter() {
    console.log('Will Enter - Cargar Mensajes');
    this.mensajes = await this.pushService.getMensajes();
  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    });
  }
}
