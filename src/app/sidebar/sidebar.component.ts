import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/clientes", title: "Clientes", icon: "pe-7s-users", class: "" },
  { path: "/facturas", title: "Facturas", icon: "pe-7s-news-paper", class: "" },
  {
    path: "/crear-factura",
    title: "Crear Factura",
    icon: "pe-7s-plus",
    class: "",
  },
  // { path: "/dashboard", title: "Dashboard", icon: "pe-7s-graph", class: "" },
  // { path: "/user", title: "User Profile", icon: "pe-7s-user", class: "" },
  // { path: "/table", title: "Table List", icon: "pe-7s-note2", class: "" },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "pe-7s-news-paper",
  //   class: "",
  // },
  // { path: "/icons", title: "Icons", icon: "pe-7s-science", class: "" },
  // { path: "/maps", title: "Maps", icon: "pe-7s-map-marker", class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   icon: "pe-7s-bell",
  //   class: "",
  // },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
