import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LbdModule } from "../../lbd/lbd.module";
import { NguiMapModule } from "@ngui/map";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { HomeComponent } from "../../home/home.component";
import { UserComponent } from "../../user/user.component";
import { TablesComponent } from "../../tables/tables.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { ClientesComponent } from "app/clientes/clientes.component";
import { FacturasComponent } from "app/facturas/facturas.component";
import {
  NgbAlertModule,
  NgbPaginationModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatSelectModule } from "@angular/material/select";
import { CrearFacturaComponent } from "app/crear-factura/crear-factura.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    LbdModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
  ],
  declarations: [
    HomeComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    ClientesComponent,
    FacturasComponent,
    CrearFacturaComponent,
  ],
})
export class AdminLayoutModule {}
