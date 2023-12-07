import { IonIcon, IonTabBar, IonTabButton, IonTabs, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsWriteComponent } from '@app/pages/products/products-write/products-write.component';
import { addIcons } from 'ionicons';
import { addOutline, chatboxEllipsesOutline, home, optionsOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  imports: [ IonTabs, IonTabBar, IonTabButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  #modalController = inject(ModalController)
  #router = inject(Router);
  #viewportScroller = inject(ViewportScroller);

  constructor() {
    addIcons({
      home,
      addOutline,
      chatboxEllipsesOutline,
      optionsOutline
    });
  }

  protected async onClickAdd() {
    const modal = await this.#modalController.create({
      component: ProductsWriteComponent
    });
    await modal.present();
    const dismiss = await modal.onWillDismiss();
    if (dismiss.role === 'confirm') {
      await this.#router.navigate(['/products']);
      this.#viewportScroller.scrollToPosition([0, 0]);
    }
  }

}
