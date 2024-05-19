import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFormatter',
  standalone: true
})
export class InputFormatterPipe implements PipeTransform {

  transform(value: string): string {
    return value.trim();
  }

}
