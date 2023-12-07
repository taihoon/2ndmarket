import sha256 from 'crypto-js/sha256';
import { filter, from, map, mergeMap, of, share, Subject, toArray } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse, HttpUploadProgressEvent } from '@angular/common/http';
import { environment } from '@environments/environment';


type CloudinaryResponseBody = {
  public_id: string;
  secure_url: string;
};

export type CloudinaryUploadFormData = {
  api_key: string;
  file: File,
  folder: string,
  public_id: string;
  signature: string;
  timestamp: string;
  transformation: string;
}

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly http = inject(HttpClient);

  #convertBlobToDataURL = (blob: Blob) =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async #createUploadData(id: string, blob: Blob, transformation: string) {
    const { apiKey, apiSecret } = environment.cloudinary;
    const timestamp = Date.now();
    const public_id = id;
    const folder = 'dev';
    const signature = `folder=${folder}&public_id=${public_id}&timestamp=${timestamp}&transformation=${transformation}${apiSecret}`; // Sort all the parameters in alphabetical order.
    const dataURL = await this.#convertBlobToDataURL(blob);

    return {
      api_key: apiKey,
      file: dataURL,
      folder,
      public_id,
      timestamp: timestamp.toString(),
      transformation,
      signature: sha256(signature).toString()
    } as CloudinaryUploadFormData;
  }

  #request(formData: CloudinaryUploadFormData) {
    const body = new FormData();
    body.append('api_key', formData.api_key);
    body.append('file', formData.file);
    body.append('folder', formData.folder);
    body.append('public_id', formData.public_id);
    body.append('timestamp', formData.timestamp);
    body.append('transformation', formData.transformation);
    body.append('signature', formData.signature);

    return this.http.post(
      environment.cloudinary.uploadUrl,
      formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );
  }

  upload(
    images: (string | Blob)[],
    transformation: string
  ): [Subject<HttpUploadProgressEvent>, Subject<string[]>] {
    const complete$ = new Subject<string[]>();
    const progress$ = new Subject<HttpUploadProgressEvent>();

    const blobs = images.filter(b => b instanceof Blob) as Blob[];

    const tuples: [string, Blob][] = blobs.map(blob =>
      [ Math.random().toString(36).substring(2, 12), blob]
    );

    const request$ = from(tuples).pipe(
      mergeMap(([id, blob]) => this.#createUploadData(id, blob, transformation)),
      mergeMap(data => this.#request(data)),
      share()
    );

    request$.pipe(
      filter(e => e.type === HttpEventType.UploadProgress )
    ).subscribe(
      e => progress$.next(e as HttpUploadProgressEvent)
    );

    request$.pipe(
      filter(e => e.type === HttpEventType.Response),
      toArray(),
      map(events => events.map(e => (e as HttpResponse<CloudinaryResponseBody>).body as CloudinaryResponseBody)),
      map(bodies => bodies.sort((a , b) =>
        tuples.findIndex(([id]) => id === a.public_id.slice(-10)) -
        tuples.findIndex(([id]) => id === b.public_id.slice(-10))
      )),
      map( bodies => bodies.map(b => b.secure_url)),
      map(urls => images.map(i => i instanceof Blob ? urls.shift() as string : i))
    ).subscribe(images =>
      complete$.next(images)
    );

    request$.subscribe({
      complete: () => {
        progress$.complete();
        complete$.complete();
      }
    });

    return [ progress$, complete$ ];
  }

}
