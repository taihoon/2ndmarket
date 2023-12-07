import { inRange } from 'lodash-es';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '@app/core/capacitor';
import { ObjectUrlPipe, SanitizerPipe } from '@app/shared/pipes';


type Image = string | Blob;

@Component({
  standalone: true,
  selector: 'app-images-control',
  imports: [ CommonModule, ObjectUrlPipe, SanitizerPipe ],
  templateUrl: './images-control.component.html',
  styleUrls: ['./images-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesControlComponent {
  readonly #galleryService = inject(GalleryService)
  readonly maxSize = 10485760 /* 10mb */;

  @Input() maxCount = 10;
  @Input() images: Image[] = [];

  #changeDetectionRef =  inject(ChangeDetectorRef);
  selected: Image | null = null;

  async onClickFile() {
    if (this.images.length >= this.maxCount) {
      alert(`이미지는 ${this.maxCount}개까지 첨부할 수 있습니다.`);
      return;
    }

    const { maxCount, maxSize } = this;

    const images = await this.#galleryService.pickImages().then(blobs => {
      if (blobs.find(blob => blob.size >= maxSize)) {
        alert('10MB 이상 이미지는 첨부할 수 없습니다.');
      }
      return blobs.filter(blob => blob.size < maxSize);
    });

    const allowCount =
      images.length + this.images.length > maxCount ?
        maxCount - this.images.length :
        images.length;

    if (allowCount < images.length) {
      alert(`${maxCount}개 이상 이미지는 첨부 할 수 없습니다.`);
    }

    this.images = this.images.concat(images.slice(0, allowCount));
    this.selected = this.selected ? this.selected : this.images[0];
    this.#changeDetectionRef.detectChanges();
  }

  onToggleSelectImage(image: Image) {
    this.selected = image;
  }

  onBlurImage() {
    this.selected = null;
  }

  onClickMoveImage(image: Image, curr: number, next: number) {
    if (inRange(next, 0, this.images.length)) {
      const i = this.images;
      [i[curr], i[next]] = [i[next], i[curr]];
    }
  }

  onClickDeleteImage(image: Image) {
    this.images = this.images.filter(item => item !== image);
    this.selected = this.images[0] || null;
  }

}
