import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular';
import { AuthService, ChattingsService } from '@app/core/http';
import { of, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DistanceToNowPipe, FsTimestampPipe } from '@app/shared/pipes';
import { Chatting } from '@app/core/model';


@Component({
  standalone: true,
  imports: [IonContent, IonButton, IonHeader, IonToolbar, IonList, IonItem, IonLabel, AsyncPipe, IonTitle, DistanceToNowPipe, FsTimestampPipe, IonNote, IonText, IonThumbnail],
  providers: [ ActionSheetController ],
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
  #authService = inject(AuthService);
  #chattingService = inject(ChattingsService);

  chattings$ = this.#authService.user$.pipe(
    switchMap(user => user ?
      this.#chattingService.getChattings(user.uid) :
      of([])
    )
  );

  onClickChatting(chatting: Chatting) {

  }

}
