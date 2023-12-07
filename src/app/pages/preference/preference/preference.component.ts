import { combineLatest, map, of} from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import type { UserGroup } from '@app/core/model';
import { AuthService, BrowsersService,FavoritesService, GroupsService, _MessagesService, UserGroupService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { BackdropService, LocationBackService } from '@app/shared/services';
import { UserDisplayNamePipe } from '@app/shared/pipes';
import { type FunctionsError } from '@angular/fire/functions'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-preference',
  imports: [CommonModule, UserDisplayNamePipe, RouterLink, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonText, IonItem, IonLabel, IonButton],
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceComponent {
  user$ = this.sessionService.user$;
  group$ = this.sessionService.group$;
  accounts$ = this.sessionService.accounts$

  counter$ = combineLatest([
    of(0),
    this.sessionService.productsCountByUser$,
    this.sessionService.favoritesCountByUser$
  ]).pipe(
    map(([messages, products, favorites]) => (
      { messages, products, favorites }
    ))
  );

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly browserService: BrowsersService,
    private readonly coverService: BackdropService,
    private readonly favoritesService: FavoritesService,
    private readonly groupService: GroupsService,
    private readonly locationBackService: LocationBackService,
    private readonly messagesService: _MessagesService,
    private readonly userGroupService: UserGroupService,
    private readonly sessionService: SessionService
  ) {
  }

  async onClickGroup(userGroup: UserGroup & { groupName: string }) {
    const currentUser = this.authService.getCurrentUser();
    const browserId = this.browserService.getBrowserId();

    if (
      !browserId ||
      currentUser?.uid === userGroup.id
    ) {
      return;
    }

    try {
      this.coverService.show('그룹전환중...');
      const { data } = await this.authService.getCustomTokenByBrowserUser(browserId, userGroup.id);
      await this.authService.signInWithCustomToken(data);
    } catch (e) {
      const { code, message } = e as FunctionsError;
      alert(`그룹전환을 할 수 없습니다(${ message || code}).`);
    } finally {
      this.coverService.hide();
    }
  }

  onClickSignOut() {
    return this.authService.signOut().then(() =>
      this.router.navigateByUrl('/auth/group-select')
    );
  }

  onClickBack() {
    this.locationBackService.back();
  }

}
