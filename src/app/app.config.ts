import { Capacitor } from '@capacitor/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { environment } from '@environments/environment';
import { ionicConfig } from '@app/ionic.config';
import { routes } from '@app/app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(ionicConfig),
    provideHttpClient(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
    ),
    importProvidersFrom(
      provideAuth(() =>
        Capacitor.isNativePlatform() ?
          initializeAuth(getApp(), { persistence: indexedDBLocalPersistence }) :
          getAuth()
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideFunctions(() => getFunctions(getApp(), 'asia-northeast3'))),
    importProvidersFrom(provideMessaging(() => getMessaging())),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}
