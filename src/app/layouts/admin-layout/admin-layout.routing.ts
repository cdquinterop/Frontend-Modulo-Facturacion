import { Routes } from "@angular/router";

import { HomeComponent } from "../../home/home.component";
import { UserComponent } from "../../user/user.component";
import { TablesComponent } from "../../tables/tables.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { ClientesComponent } from "app/clientes/clientes.component";
import { FacturasComponent } from "app/facturas/facturas.component";
import { CrearFacturaComponent } from "app/crear-factura/crear-factura.component";

export const AdminLayoutRoutes: Routes = [
  { path: "clientes", component: ClientesComponent },
  { path: "facturas", component: FacturasComponent },
  { path: "crear-factura", component: CrearFacturaComponent },
  // { path: "dashboard", component: HomeComponent },
  // { path: "user", component: UserComponent },
  // { path: "table", component: TablesComponent },
  // { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  // { path: "notifications", component: NotificationsComponent },
];
