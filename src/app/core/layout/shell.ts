import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header';
import { Nav } from './nav';

/**
 * Layout for every signed-in page: header, side navigation and the page content.
 * Used as a parent route, so pages such as a future login screen can sit outside it.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Nav],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
