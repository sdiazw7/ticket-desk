import { Component, input } from '@angular/core';

/** A small spinner with a text label. Announced politely by screen readers. */
@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
  readonly label = input('Loading...');
}
