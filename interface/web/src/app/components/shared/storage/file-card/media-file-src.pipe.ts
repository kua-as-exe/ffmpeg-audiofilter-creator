import { Pipe, PipeTransform } from '@angular/core';
import { MediaFile } from '../../../../../../../../src/storage';

@Pipe({
  name: 'mediaFileSrc'
})
export class MediaFileSrcPipe implements PipeTransform {

  transform(file: MediaFile): string {
    if(file.status == 'firebase') return file.downloadUrl;
    return `media/${file.filename}/${file.filename}`;
  }

}
