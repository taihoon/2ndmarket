import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '@app/core/session';


@Component({
  standalone: true,
  selector: 'app-preference-favorites',
  imports: [CommonModule, RouterLink, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent],
  templateUrl: './preference-favorites.component.html',
  styleUrls: ['./preference-favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceFavoritesComponent {
  user$ = inject(SessionService).user$;
  favorites$ = inject(SessionService).favoritesByUser$
}
