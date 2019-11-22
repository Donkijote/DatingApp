import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
import iziToast from 'izitoast';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor() {}

  confirm(message: string, okCallback: () => any) {
    /*alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      }
    });*/
    iziToast.question({
      timeout: false,
      close: true,
      overlay: true,
      color: 'red',
      messageColor: 'black',
      messageSize: '18',
      id: 'question',
      zindex: 999,
      title: 'Hey',
      message,
      position: 'center',
      buttons: [
        [
          '<button>Ok</button>',
          (instance, toast) => {
            okCallback();
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          },
          true
        ]
      ]
    });
  }

  success(resp: any) {
    iziToast.success({
      message: resp
    });
  }

  error(resp: any) {
    iziToast.error({
      title: 'Error',
      message: resp
    });
  }

  warning(resp: any) {
    iziToast.warning({
      title: 'Caution',
      message: resp
    });
  }

  message(resp: any) {
    iziToast.info({
      message: resp
    });
  }
}
