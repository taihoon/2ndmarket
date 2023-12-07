import { IonApp, IonBackdrop, IonRouterOutlet, IonSpinner } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackdropService } from '@app/shared/services';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonRouterOutlet, IonBackdrop, IonSpinner, IonApp],
  providers: [ BackdropService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  backdropService = inject(BackdropService)
}
