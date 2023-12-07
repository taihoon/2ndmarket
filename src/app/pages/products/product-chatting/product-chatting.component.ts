import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { millisecondsToMinutes } from 'date-fns';
import { filter, first, firstValueFrom, map, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { User } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Chatting, Product } from '@app/core/model';
import { ChattingsService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { FsTimestampPipe } from '@app/shared/pipes';
import { whitespaceValidator } from '@app/shared/validators';


@Component({
  standalone: true,
  selector: 'app-product-chatting',
  templateUrl: './product-chatting.component.html',
  styleUrls: ['./product-chatting.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, ReactiveFormsModule, IonIcon, IonList, IonItem, FsTimestampPipe, IonGrid, IonRow, IonCol, IonBackButton, IonButtons],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductChattingComponent {
  @Input() set chattingId(id: string) {
    id && this.#chattingId$.next(id);
  }

  readonly #chattingId$ = new ReplaySubject<string>(1);
  readonly #chattingService = inject(ChattingsService);
  readonly #sessionService = inject(SessionService);
  readonly #product$ = new ReplaySubject<Product>(1);

  user$ = this.#sessionService.user$;
  chatting$ = this.#chattingId$.pipe(
    switchMap(chattingId => this.#chattingService.getChatting(chattingId)),
    shareReplay(1)
  );

  messages$ = this.chatting$.pipe(
    filter(chatting => !!chatting),
    first(),
    switchMap(chatting => this.#chattingService.getMessages((chatting as Chatting).id)),
    map(messages => messages.map((message, i, sources) => ({
      ...message,
      withinTime: millisecondsToMinutes(message.created.toMillis() - sources[i-1]?.created.toMillis()) <= 5,
      sameUidAsBefore: message.uid == sources[i - 1]?.uid,
      sameUidAsAfter: message.uid == sources[i + 1]?.uid
    }))),
    tap(m => console.log('m', m))
  );

  chattingForm = new FormGroup({
    message: new FormControl('', { validators: [ whitespaceValidator ] })
  });

  get message() { return this.chattingForm.controls.message }

  constructor() {
    addIcons({personOutline})
  }

  async onSubmit() {
    if (this.chattingForm.invalid) {
      return;
    }

    const message = (this.message.value as string).trim();
    const user = await firstValueFrom(this.#sessionService.user$) as User;

    const addMessage$ = this.#chattingId$.pipe(
      first(),
      filter(chattingId => !!chattingId),
      switchMap(chattingId => this.#chattingService.addMessage(
        chattingId,
        {
          uid: user.uid,
          body: message,
          created: serverTimestamp()
        })
      )
    );

    addMessage$.pipe(
      first()
    ).subscribe(m =>
      this.chattingForm.reset()
    );
  }

}
