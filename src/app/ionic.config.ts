import { isPlatform } from '@ionic/angular/standalone';


export const ionicConfig = {
  animated: isPlatform('mobile'),
  backButtonDefaultHref: '/',
  backButtonText: '',
  backButtonIcon: 'assets/arrow-back.svg'
}
