import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';


@Pipe({
  name: 'static'
})
export class StaticPipe implements PipeTransform {

  transform(fileServerUrl: string): string {
    return environment.APIURL.slice(0,-1) + fileServerUrl;
  }

}
