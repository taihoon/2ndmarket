import { combineLatest, debounceTime, first, map, of, shareReplay, switchMap, zip } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService, BrowsersService, FavoritesService, GroupsService, ProductsService, UserGroupService } from '@app/core/http';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user$ = this.authService.user$;
  group$ = this.user$.pipe(
    switchMap(user => user ?
      this.userGroupService.getUserGroupByUid(user.uid) :
      of(undefined)
    ),
    switchMap(group => group ?
      this.groupsService.getGroup(group.groupId) :
      of(undefined)
    ),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // private userGroups$ =
  //
  // );
  //
  // private groups$ =
  //   this.userGroups$.pipe(
  //     switchMap(userGroups => {
  //       const groupIds = userGroups.map(userGroup => userGroup.groupId);
  //       return this.groupsService.getGroupsByIds(groupIds);
  //     })
  // );

  accounts$ =
    this.browserService.getBrowserUser().pipe(
      switchMap(uids => uids ?
        this.userGroupService.getUserGroupsByUids(uids) :
        of([])
      ),
      switchMap(userGroups => zip(
        of(userGroups),
        this.groupsService.getGroupsByIds(
          userGroups.map(userGroup => userGroup.groupId)
        )
      )),
      debounceTime(140),
      map(([userGroups, groups]) =>
        userGroups.map(userGroup => ({
          ...userGroup,
          groupName: groups.find(group => group.id === userGroup.groupId)?.name || ''
        }))
      ),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  userWithGroup$ = combineLatest([
    this.user$,
    this.group$
  ]).pipe(
    map(([user, group]) => ({ user, group })),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  productsByGroup$ =
    this.group$.pipe(
      switchMap(group => group ?
        this.productsService.getProductsByGroup(group.id) :
        of([])
      ),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  productsByUser$ =
    this.user$.pipe(
      switchMap(user => user ?
        this.productsService.getProductsByUser(user.uid) :
        of(undefined)
      ),
      shareReplay({ bufferSize: 1, refCount: false})
    );

  favoritesByUser$ =
    this.user$.pipe(
      switchMap(user => user ?
        this.favoritesService.getFavoritesByUid(user.uid) :
        of(undefined)
      ),
      shareReplay({ bufferSize: 1, refCount: false})
    )

  productsCountByUser$ =
    this.productsByUser$.pipe(
      map(products => products ? products.length : 0)
    );

  favoritesCountByUser$ =
    this.favoritesByUser$.pipe(
      map(products => products ? products.length : 0)
    );

  constructor(
    private readonly authService: AuthService,
    private readonly browserService: BrowsersService,
    private readonly favoritesService: FavoritesService,
    private readonly groupsService: GroupsService,
    private readonly productsService: ProductsService,
    private readonly userGroupService: UserGroupService
  ) {
    this.group$.pipe(first()).subscribe();
    this.accounts$.pipe(first()).subscribe();
    this.productsByGroup$.pipe(first()).subscribe();
    this.productsByUser$.pipe(first()).subscribe();
    this.favoritesByUser$.pipe(first()).subscribe();

    this.user$.pipe(first()).subscribe(u => console.log('user', u));
  }

}
