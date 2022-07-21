import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Factura, Producto } from "app/facturas/facturas.component";
import { FacturaSave } from "app/crear-factura/crear-factura.component";
@Injectable({
  providedIn: "root",
})
export class FacturasService {
  private baseUrl: string = "https://api-facturacion-utn.herokuapp.com";
  constructor(public http: HttpClient) {}

  public getFacturas() {
    return this.http.get<Factura[]>(this.baseUrl + "/facturas");
  }
  public getNumeroFacturas() {
    return this.http.get<{ nro_factura: string }>(
      this.baseUrl + "/facturas/siguiente_numero"
    );
  }
  public getProductos() {
    return this.http.get<Producto[]>(
      "https://api-modulo-inventario.herokuapp.com/productos"
    );
  }
  public updateFactura(factura: Factura) {
    return this.http.put<Factura>(this.baseUrl + "/facturas", factura);
  }
  public deleteFactura(factura: Factura) {
    return this.http.put<Factura>(this.baseUrl + "/facturas", factura);
  }
  public createFactura(factura: FacturaSave) {
    return this.http.post<Factura>(this.baseUrl + "/facturas", factura);
  }
}
