import { filter, first, pairwise } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LocationBackService {

  private navigated = false;

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      pairwise(),
      first()
    ).subscribe(() => {
      this.navigated = true;
    });
  }

  back(fallbackToHome = true) {
    fallbackToHome && !this.navigated ?
      this.router.navigateByUrl('/') :
      this.location.back()
  }

}
