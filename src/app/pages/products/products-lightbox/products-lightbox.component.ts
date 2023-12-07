import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';


@Component({
  standalone: true,
  selector: 'app-products-lightbox',
  imports: [CommonModule, IonContent, IonToolbar, IonTitle, IonHeader, IonButtons, IonIcon],
  templateUrl: './products-lightbox.component.html',
  styleUrls: ['./products-lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsLightboxComponent implements AfterViewInit{
  @Input() title!: string;
  @Input() images!: string[];
  @Input() selected!: number;
  @ViewChild('list') $list!: ElementRef;

  readonly #modalController = inject(ModalController);

  constructor() {
    addIcons({ closeOutline })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const $target = this.$list.nativeElement.children[this.selected];
      this.$list.nativeElement.scrollTo($target.offsetLeft, 0);
    }, 32);
  }

  onClickClose() {
    this.#modalController.dismiss().then();
  }

}
