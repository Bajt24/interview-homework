import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private nextId = 1;

  public showSuccess(message: string, duration = 4000) {
    this.addToast({
      id: this.nextId++,
      message,
      type: 'success',
      duration
    });
  }

  public showDanger(message: string, duration = 5000) {
    this.addToast({
      id: this.nextId++,
      message,
      type: 'danger',
      duration
    });
  }

  private addToast(toast: Toast) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  public removeToast(id: number) {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  public clearAll(): void {
    this.toastsSubject.next([]);
  }
}
