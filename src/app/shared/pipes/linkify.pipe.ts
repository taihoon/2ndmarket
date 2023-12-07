import { Pipe, PipeTransform } from '@angular/core';
import { tokenizer } from '@tinkoff/tokenizer';


@Pipe({
  standalone: true,
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  isValidHttpUrl(url: string) {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return false;
    }
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  }

  transform(value: string): unknown {
    return tokenizer(value).map(
      ({type, value}) => type === 'domain' && this.isValidHttpUrl(value) ?
        `<a href="${value}">${value}</a>`:
        value.replace('\n', '<br>')
    ).join();
  }

}
