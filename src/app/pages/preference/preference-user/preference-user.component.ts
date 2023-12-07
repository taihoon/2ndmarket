import { head } from 'lodash-es';
import { first, map, of, switchMap } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService, CloudinaryService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { BackdropService, LocationBackService } from '@app/shared/services';
import { ObjectUrlPipe, SanitizerPipe, UserDisplayNamePipe } from '@app/shared/pipes';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-preference-user',
  imports: [CommonModule, ReactiveFormsModule, UserDisplayNamePipe, ObjectUrlPipe, SanitizerPipe, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent],
  templateUrl: './preference-user.component.html',
  styleUrls: ['./preference-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceUserComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #cloudinaryService = inject(CloudinaryService);
  readonly #backdropService = inject(BackdropService);
  readonly #sessionService = inject(SessionService);

  user$ = this.#sessionService.user$;
  image!: string | File;

  profileForm = new FormGroup({
    displayName: new FormControl('', { nonNullable: true })
  });

  get displayName() {
    return this.profileForm.controls.displayName
  }

  ngOnInit() {
    this.user$.pipe(
      first()
    ).subscribe(user => {
      if (user && user.displayName) {
        this.displayName.setValue(user.displayName);
      }
      if (user && user.photoURL) {
        this.image = user.photoURL;
      }
    });
  }

  onChangeFile(e: Event) {
    const { files } = e.target as HTMLInputElement;

    if (!files || files.length === 0) {
      return;
    }

    const validatedFiles = Array
      .from(files)
      .filter(file => file.size < 10485760 /* 10mb */);

    if (files.length > validatedFiles.length) {
      alert('10MB 이상 이미지는 첨부할 수 없습니다.');
    } else {
      this.image = head(files) as File;
    }
  }

  // onClickRotate(draftImage: CloudinaryUploadItem, degree: number) {
  //   draftImage.context.rotate = (draftImage.context.rotate + degree) % 360;
  // }

  // onRemoveProfile() {
  //
  // }

  onSubmit() {
    const image = this.image;
    const displayName = this.displayName.value;

    if (!image || !displayName) {
      return;
    }

    this.#backdropService.show('프로필 변경중 입니다.');

    of(image).pipe(
      switchMap(image => {
        if (image instanceof File) {
          const [, uploadComplete$] =
            this.#cloudinaryService.upload([image], 't_profile');
          return uploadComplete$.pipe(
            map(uploaded => head(uploaded) as string)
          );
        } else {
          return of(image);
        }
      }),
      switchMap(photoURL =>
        this.#authService.updateUserInfo({
          displayName,
          photoURL
        })
      )
    ).subscribe(() => {
      this.#backdropService.hide();
    });
  }

}
