import { map, shareReplay, switchMap, tap } from 'rxjs';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsService, VerificationService } from '@app/core/http';
import { BackdropService } from '@app/shared/services';


@Component({
  standalone: true,
  selector: 'app-group-select',
  imports: [CommonModule, ReactiveFormsModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonText, IonSelect, IonSelectOption, IonButton, FormsModule],
  templateUrl: './group-select.component.html',
  styleUrls: ['./group-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupSelectComponent{
  #submitting = false;
  groupForm = new FormGroup({
    group: new FormControl<string>('', { nonNullable: true }),
    domain: new FormControl<string>('', { nonNullable: true }),
    account: new FormControl<string>('', { nonNullable: true })
  });

  groups$ = this.groupsService.getGroups().pipe(
    shareReplay(1)
  );

  domains$ = this.groupForm.controls.group.valueChanges.pipe(
    switchMap(groupId =>
      this.groups$.pipe(
        map(groups => groups.find(group => group.id === groupId))
      )
    ),
    map(group => group?.domains),
    tap(() => this.groupForm.controls.domain.reset())
  );

  domain$ = this.groupForm.controls.domain.valueChanges;

  get group() { return this.groupForm.controls.group }
  get domain() { return this.groupForm.controls.domain }
  get account() { return this.groupForm.controls.account }

  constructor(
    private readonly router: Router,
    private readonly backdropService: BackdropService,
    private readonly groupsService: GroupsService,
    private readonly verificationService: VerificationService
  ) { }

  async onSubmit() {
    if (this.#submitting || this.groupForm.invalid) {
      return;
    }

    this.#submitting = true;
    this.backdropService.show();

    const group = this.group.value;
    const domain = this.domain.value;
    const account = this.account.value;
    const email = `${account}@${domain}`;

    this.verificationService
      .createVerification(group, email)
      .then(({ data: verificationId }) => {
        console.log('v', verificationId);
        return this.router.navigate(['/auth', 'group-verification', verificationId])
      })
      .finally(() =>
        this.backdropService.hide()
      );
  }

}
