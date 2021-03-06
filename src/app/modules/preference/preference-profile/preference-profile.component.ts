import { isEmpty, head } from 'lodash-es';
import { merge } from 'rxjs';
import { filter, first, map, mapTo, share, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService, CloudinaryUploadService, ProfilesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';
import { CoverService } from '@app/modules/components/services';
import { DraftImage } from '@app/core/model';

@Component({
  selector: 'app-preference-profile, [app-preference-profile]',
  templateUrl: './preference-profile.component.html',
  styleUrls: ['./preference-profile.component.scss']
})
export class PreferenceProfileComponent implements OnInit {
  draftImage: DraftImage;
  profileForm = this.fb.group({
    displayName: [],
  });

  profile$ = this.authService.profileExt$.pipe(
    first(),
    filter(p => !!p),
    tap(profile => this.displayNameCtl.setValue(profile.displayName)),
    tap(profile => {
      this.draftImage = {
        isFile: false,
        src: profile.photoURL,
        rotate: 0
      };
    })
  );

  get displayNameCtl() { return this.profileForm.get('displayName'); }

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private coverService: CoverService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService,
    private cloudinaryUploadService: CloudinaryUploadService
  ) {
  }

  ngOnInit(): void {
  }

  onChangeFile(e: Event) {
    const target = e.target as HTMLInputElement;
    this.draftImage = {
      isFile: true,
      file: target.files[0],
      rotate: 0
    };
    target.value = '';
  }

  onClickRotateImage(rotate) {
    this.draftImage = {
      ...this.draftImage,
      rotate: (this.draftImage.rotate + rotate) % 360
    };
  }

  onCancelChangeFile(e: Event) {
    this.draftImage = {
      isFile: false,
      src: this.authService.profile.photoURL,
      rotate: 0
    };
  }

  onSubmit() {
    this.coverService.show('???????????? ???????????? ????????????.');
    this.profileForm.disable();
    const profile = this.authService.profile;
    this.draftImage = {
      ...this.draftImage,
      context: `type=profile|id=${profile.id}`
    };
    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload([this.draftImage]);
    uploadComplete$.pipe(
      switchMap(urls => {
        return this.profilesService.update(profile.id, {
          photoURL: urls[0],
          displayName: this.displayNameCtl.value
        });
      }),
      switchMap(() => this.profileSelectService.update(profile.id))
    ).subscribe(() => {
      alert('???????????? ??????????????????!');
      this.profileForm.enable();
      this.coverService.hide();
    }, err => {
      alert(err);
      this.profileForm.enable();
      this.coverService.hide();
    });
  }

  onRemoveProfile() {
    if (!confirm('????????? ????????? ?????????????????????????\n???????????? ????????? ????????? ???????????? ????????????.\n(?????? ???????????? ?????? ????????? ???????????? ?????? ????????? ??? ????????????.)')) {
      return;
    }

    this.coverService.show('???????????? ??????????????? ????????????.');

    const { user, profile } = this.authService;
    const profiles$ = fromPromise(this.profilesService.updateUserIdRemove(profile.id, user.id)).pipe(
      switchMap(() => this.profilesService.getQueryByUserId(user.id)),
      share()
    );

    const select$ = profiles$.pipe(
      first(),
      filter(profiles => !isEmpty(profiles)),
      map(p => head(p)),
      switchMap(p => this.profileSelectService.select(p.id)),
      mapTo(true)
    );

    const remove$ = profiles$.pipe(
      first(),
      filter(profiles => isEmpty(profiles)),
      tap(() => this.profileSelectService.remove()),
      mapTo(false)
    );

    merge(select$, remove$).pipe(
      first()
    ).subscribe((selected) => {
      this.coverService.hide();
      this.router.navigate(selected ? ['/goods'] : ['/preference', 'goods']);
    }, err => {
      alert(err);
      this.coverService.hide();
    });
  }

  onClickHistoryBack() {
    this.location.back();
  }
}
