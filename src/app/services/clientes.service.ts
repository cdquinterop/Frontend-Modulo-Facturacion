import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Cliente } from "app/clientes/clientes.component";

@Injectable({
  providedIn: "root",
})
export class ClientesService {
  private baseUrl: string = "https://api-facturacion-utn.herokuapp.com";
  constructor(public http: HttpClient) {}

  public getClientes() {
    return this.http.get<Cliente[]>(this.baseUrl + "/clientes");
  }
  public updateCliente(cliente: Cliente) {
    return this.http.put<Cliente>(this.baseUrl + "/clientes", cliente);
  }
  public deleteCliente(cliente: Cliente) {
    return this.http.delete<Cliente>(this.baseUrl + "/clientes", {
      body: cliente,
    });
  }
  public createCliente(cliente: Cliente) {
    return this.http.post<Cliente>(this.baseUrl + "/clientes", cliente);
  }
}
