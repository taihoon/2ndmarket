import { Observable, of } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { _Message } from '@app/core/model';
import { SessionService } from '@app/core/session';
import { LocationBackService } from '@app/shared/services';
import { DistanceToNowPipe, FsTimestampPipe } from '@app/shared/pipes';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-preference-messages',
    imports: [CommonModule, FsTimestampPipe, DistanceToNowPipe, RouterLink, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
  templateUrl: './preference-messages.component.html',
  styleUrls: ['./preference-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceMessagesComponent {
  messages$:Observable<_Message[]> = of([]);

  constructor(
    private readonly locationBackService: LocationBackService,
    private readonly sessionService: SessionService

  ) { }

  trackById(index: number, item: _Message) {
    return item.id;
  }

  onClickMessage(message: _Message) {
    console.log('message', message);
  }

  // onClickDeleteMessage() {
  // }

  onClickBack() {
    this.locationBackService.back();
  }


}
