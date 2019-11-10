import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
import iziToast from 'izitoast';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor() {}

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      }
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
