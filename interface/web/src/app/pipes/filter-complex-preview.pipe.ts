import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterComplexPreview'
})
export class FilterComplexPreviewPipe implements PipeTransform {

  transform(text: string): unknown {
    text = text.replace(/:/g, ":\n");
    text = text.replace(/;/g, ";\n\n");
    return text;
  }

}
