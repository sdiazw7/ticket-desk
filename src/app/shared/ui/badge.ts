import { Component, input } from '@angular/core';

export type BadgeTone = 'info' | 'warning' | 'success' | 'danger' | 'neutral';

/**
 * A small colored label. Generic: callers decide the tone and supply the text,
 * for example <app-badge tone="success">Resolved</app-badge>.
 */
@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
}
