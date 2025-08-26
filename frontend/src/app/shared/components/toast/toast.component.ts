import { Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  standalone: true,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  public closeToast(toastId: number): void {
    this.toastService.removeToast(toastId);
  }

  public trackByToastId(index: number, toast: Toast): number {
    return toast.id;
  }
}
