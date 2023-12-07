import { first, firstValueFrom, map, of, shareReplay, switchMap } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService, BrowsersService, GroupsService, UserGroupService, VerificationService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { BackdropService } from '@app/shared/services';
import { TimerDirective } from '@app/shared/directives';
import { FunctionsError } from '@angular/fire/functions';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-group-verification',
  imports: [CommonModule, ReactiveFormsModule, TimerDirective, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, IonText, IonList, IonItem, IonInput, IonButton],
  templateUrl: './group-verification.component.html',
  styleUrls: ['./group-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupVerificationComponent implements  OnInit, OnDestroy {
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #backdropService = inject(BackdropService);
  readonly #browserService = inject(BrowsersService);
  readonly #userGroupService = inject(UserGroupService);
  readonly #verificationService = inject(VerificationService);

  verifyForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    code: new FormControl('', { nonNullable: true })
  });

  timeEnd = false;

  verification$ = this.#activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('verificationId')),
    switchMap(id => id ?
      this.#verificationService.getVerification(id) :
      of(undefined)
    ),
    shareReplay(1)
  );

  // @ViewChild(TimerDirective) timer!: TimerDirective;
  get email() { return this.verifyForm.controls.email }
  get code() { return this.verifyForm.controls.code }

  ngOnInit() {
    this.verification$.pipe(first()).subscribe(verification => {
      this.email.disable();
      return verification ?
        this.email.setValue(verification.email) :
        this.#router.navigate(['/auth', 'group-select']);
    });
  }

  ngOnDestroy() {
    this.verification$.pipe(
      first(),
      switchMap(verification => verification ?
        this.#verificationService.deleteVerification(verification.id) :
        of(undefined)
      )
    ).subscribe();
  }

  onTimerEnd() {
    this.timeEnd = true;
  }

  onClickRetryValidate() {
    return this.#router.navigate(['/auth', 'group-select'], { replaceUrl: true });
  }

    async onSubmit() {
      const verification =
        await firstValueFrom(this.verification$);

      if (!verification || this.timeEnd) {
        return;
      }

      try {
        this.#backdropService.show();
        const code = this.code.value;
        const { id: verificationId, groupId, email } = verification;
        const { userRecord, token } =
          await this.#authService
            .getCustomTokenByVerification(verificationId, code)
            .then(result => result.data);

        if (userRecord?.uid) {
          await this.#authService.signInWithCustomToken(token);
          await this.#userGroupService.setUserGroup(
            userRecord.uid,
            {groupId, email});
          await this.#browserService.setBrowserUser(userRecord.uid);
          this.#router.navigate(['/products'], { replaceUrl: true }).then();
        }
      } catch (e) {
        const { code, message } =  (e as FunctionsError);
        if (message === 'invalid code') {
          alert('인증 번호가 일치하지 않습니다.');
        } else if (message === 'out of time') {
          alert('입력 시간이 지났습니다.');
        } else {
          alert(`로그인 할 수 없습니다${ message || code }.`);
        }
      } finally {
        this.#backdropService.hide();
      }
    }
}
// export class _GroupVerificationComponent implements OnInit, OnDestroy {
//   timeEnd = false;
//
//   verifyForm = new FormGroup({
//     email: new FormControl('', { nonNullable: true }),
//     code: new FormControl('', { nonNullable: true })
//   });
//
//   verification$ = this.activatedRoute.paramMap.pipe(
//     map(paramMap => paramMap.get('verificationId')),
//     switchMap(id => id ?
//       this.verificationService.getVerification(id) :
//       of(undefined)
//     ),
//     shareReplay({ bufferSize: 1, refCount: false })
//   );
//
//   @ViewChild(TimerDirective) timer!: TimerDirective;
//   get email() { return this.verifyForm.controls.email }
//   get code() { return this.verifyForm.controls.code }
//   get verificationId() { return this.activatedRoute.snapshot.paramMap.get('verificationId') }
//
//   constructor(
//     private readonly router: Router,
//     private readonly activatedRoute: ActivatedRoute,
//     private readonly authService: AuthService,
//     private readonly browserService: BrowsersService,
//     private readonly coverService: BackdropService,
//     private readonly groupsService: GroupsService,
//     private readonly userGroupService: UserGroupService,
//     private readonly verificationService: VerificationService,
//     private readonly sessionService: SessionService
//   ) {
//   }
//
//   async ngOnInit() {
//     this.verification$
//       .pipe(
//         first()
//       )
//       .subscribe(verification => {
//         if (!verification)  {
//           // this.router.navigate(['auth', 'group-select']).then();
//         } else {
//           this.email.setValue(verification.email);
//         }
//       });
//   }
//
//   ngOnDestroy() {
//     const verificationId = this.verificationId;
//     if (verificationId) {
//       this.verificationService.deleteVerification(verificationId).then();
//     }
//   }
//
//   onTimerEnd() {
//     this.timeEnd = true;
//   }
//
//   onClickBack() {
//     this.router.navigate(['auth', 'group-select']).then();
//   }
//
//   async onSubmit() {
//     // if (!await this.validateSubmit()) {
//     //   return;
//     // }
//
//     const verification =
//       await firstValueFrom(this.verification$);
//
//     if (!verification) {
//       return;
//     }
//
//     try {
//       this.coverService.show('');
//       const code = this.code.value;
//       const { id: verificationId, groupId, email } = verification;
//       const { userRecord, token } =
//         await this.authService
//           .getCustomTokenByVerification(verificationId, code)
//           .then(result => result.data);
//
//       if (userRecord?.uid) {
//         await this.authService.signInWithCustomToken(token);
//         await this.userGroupService.setUserGroup(
//           userRecord.uid,
//           {groupId, email});
//         await this.browserService.setBrowserUser(userRecord.uid);
//         this.router.navigate(['products']).then();
//       }
//     } catch (e) {
//       const { code, message } =  (e as FunctionsError);
//       if (message === 'invalid code') {
//         alert('인증 번호가 일치하지 않습니다.');
//       } else if (message === 'out of time') {
//         alert('입력 시간이 지났습니다.');
//       } else {
//         alert(`로그인 할 수 없습니다${ message || code }.`);
//       }
//     } finally {
//       this.coverService.hide();
//     }
//   }
//
//   // private async validateSubmit() {
//   //   const verification =
//   //     await firstValueFrom(this.verification$);
//   //
//   //   if (
//   //     !verification ||
//   //     this.verifyForm.invalid
//   //   ) {
//   //     alert('옳바른 인증 정보가 아닙니다.');
//   //     return false;
//   //   }
//   //
//   //   const difference = differenceInMinutes(
//   //     new Date(),
//   //     verification.created.toDate()
//   //   );
//   //
//   //   if (
//   //     this.timer.status === 'end' ||
//   //     difference > 3
//   //   ) {
//   //     alert('코드 입력 시간이 지났습니다.');
//   //     return false;
//   //   }
//   //
//   //   const passcode =
//   //     md5(this.code.value).toString() === verification.code;
//   //
//   //   if (!passcode) {
//   //     alert('인증 번호가 일치하지 않습니다.');
//   //     return false;
//   //   }
//   //
//   //   return true;
//   // }
//
//   async onClickRetrySendVerifyEmail() {
//     const verification = await firstValueFrom(this.verification$);
//
//     if (!verification) {
//       return;
//     }
//
//     this.coverService.show('');
//
//     const { email, groupId } = verification;
//     this.verificationService.deleteVerification(verification.id).then();
//     this.verificationService
//       .createVerification(groupId, email)
//       .then(({ data: verificationId }) => {
//         return this.router.navigate(['auth', 'group-verification', verificationId]);
//       })
//       .finally(() => {
//         this.timer.start(1000 * 60 * 3);
//         this.code.setValue('');
//         this.timeEnd = false;
//         this.coverService.hide();
//       });
//   }
// }
