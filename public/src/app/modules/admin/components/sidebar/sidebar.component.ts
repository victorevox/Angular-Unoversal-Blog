import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigableLink } from "@app/interfaces";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  constructor(private _router: Router) { }

  public links: NavigableLink[] = [
    {
      name: "Dashboard",
      url: "/admin/dashboard"
    },
    {
      name: "Posts",
      url: "/admin/posts"
    },
    {
      name: "Pages",
      url: "/admin/pages"
    },
    {
      name: "Map",
      url: "/admin/map"
    },
    
  ]

  public isLinkActive(url: string): boolean {
    console.log(this._router.routerState.snapshot.url)
    return (this._router.routerState.snapshot.url === url);
  }

  ngOnInit() {
  }

}
