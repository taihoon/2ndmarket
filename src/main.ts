import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { environment } from '@environments/environment';
import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.config';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig);
