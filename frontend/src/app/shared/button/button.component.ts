import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button>
      <span *ngIf="icon" class="material-symbols-outlined">{{ icon }}</span>
      {{ text }}
    </button>
  `,
  imports: [
    NgIf
  ],
  styles: [`
    :host {
      display: flex;
      width: fit-content;
    }

    button {
      cursor: pointer;
      border: 0;
      border-radius: 7px;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        transition: all 0.3s ease;
        background: darkgrey;
      }
    }

    .material-symbols-outlined {
      font-size: 20px;
    }
  `]
})
export class ButtonComponent {
  @Input() text: string;
  @Input() icon: string;
}
