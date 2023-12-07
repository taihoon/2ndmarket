import { Camera, GalleryImageOptions } from '@capacitor/camera';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  readonly #options = { quality: 70, limit: 10, presentationStyle: 'popover' };
  constructor() { }

  async pickImages(options: GalleryImageOptions = {}) {
    options = { ...this.#options, ...options } as GalleryImageOptions;
    const { photos } = await Camera.pickImages(options);
    return await Promise.all(photos.map(async photo => {
      return await this.#convertPathToBlob(photo.webPath);
    }));
  }

  async #convertPathToBlob(path: string) {
    const response = await fetch(path);
    return await response.blob();
  }
}
