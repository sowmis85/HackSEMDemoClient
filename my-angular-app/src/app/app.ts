import { Component, OnInit, signal, inject } from '@angular/core';
import { RuntimeErrorCode } from '@angular/platform-server';
import { RouterOutlet } from '@angular/router';
import { Route } from '@angular/router';
import { Router } from 'express';


@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
protected readonly title = signal('my-angular-app');
private route=inject(Router);
}
