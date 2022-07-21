import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { Router } from "@angular/router";
import { Cliente } from "app/clientes/clientes.component";
import { Factura, Producto } from "app/facturas/facturas.component";
import { ClientesService } from "app/services/clientes.service";
import { FacturasService } from "app/services/facturas.service";
import { ReplaySubject, Subject, takeUntil } from "rxjs";
declare var $: any;

export interface ProductoFactura {
  prod_id: number;
  cantidad: number;
  pro_pvp: number;
  pro_iva: boolean;
  pro_nombre: string;
  total: number;
}
export interface FacturaSave {
  nro_factura: string;
  cliente_cedula: string;
  tipo_pago: string;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: boolean;
  detalle: ProductoFactura[];
}

@Component({
  selector: "app-crear-factura",
  templateUrl: "./crear-factura.component.html",
  styleUrls: ["./crear-factura.component.scss"],
})
export class CrearFacturaComponent implements OnInit {
  public createFacturaData: Factura = {
    id: 0,
    nro_factura: "",
    cliente_cedula: "",
    tipo_pago: "efectivo",
    fecha: "",
    subtotal: 0,
    iva: 0,
    total: 0,
    estado: true,
  };
  public nroFactura = "";
  public clienteSeleccionado: Cliente | null = null;
  public productoSeleccionado: Producto | null = null;
  public productoParaFactura: ProductoFactura | null = null;
  public tipoPago = "efectivo";
  public fechaFactura;
  /** list of clientes */
  protected clientes: Cliente[] = [];

  /** control for the selected cliente */
  public clienteCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public clienteFilterCtrl: FormControl = new FormControl();

  /** list of clientes filtered by search keyword */
  public filteredClientes: ReplaySubject<Cliente[]> = new ReplaySubject<
    Cliente[]
  >(1);
  @ViewChild("singleSelect") singleSelect: MatSelect;

  /** control for the selected producto */
  public productoCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public productoFilterCtrl: FormControl = new FormControl();

  /** list of productos filtered by search keyword */
  public filteredProductos: ReplaySubject<Producto[]> = new ReplaySubject<
    Producto[]
  >(1);
  @ViewChild("singleSelect") singleSelectProductos: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  public listaProductos: Producto[] = [];

  public productosFacturaDetalle: ProductoFactura[] = [];

  public subtotalFactura: number = 0;
  public ivaFactura: number = 0;
  public totalFactura: number = 0;

  constructor(
    private facturasService: FacturasService,
    private clienteService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let date = new Date();
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    this.fechaFactura = dateString;

    // load the initial cliente list
    this.filteredClientes.next(this.clientes.slice());
    this.filteredProductos.next(this.listaProductos.slice());

    // listen for search field value changes
    this.clienteFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClientes();
      });
    this.productoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProductos();
      });
    this.facturasService.getNumeroFacturas().subscribe(
      (data) => {
        this.nroFactura = data.nro_factura;
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
    this.getClientes();
    this.getProductos();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  getClientes() {
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
        this.filteredClientes.next(data.filter((cliente) => cliente.estado));
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
  }
  getProductos() {
    this.facturasService.getProductos().subscribe(
      (data) => {
        this.listaProductos = data;
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
  }

  showNotification(
    type: "info" | "success" | "warning" | "danger",
    message: string
  ) {
    $.notify(
      {
        icon: "pe-7s-gift",
        message: message,
      },
      {
        type: type,
        timer: 1000,
        placement: {
          from: "bottom",
          align: "left",
        },
      }
    );
  }
  protected filterClientes() {
    if (!this.clientes) {
      return;
    }
    // get the search keyword
    let search = this.clienteFilterCtrl.value;
    if (!search) {
      this.filteredClientes.next(
        this.clientes.filter((cliente) => cliente.estado)
      );
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the clientes
    this.filteredClientes.next(
      this.clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().indexOf(search) > -1 && cliente.estado
      )
    );
  }
  onClientesChange(event) {
    this.clienteSeleccionado = event.value;
  }
  protected filterProductos() {
    if (!this.listaProductos) {
      return;
    }
    // get the search keyword
    let search = this.productoFilterCtrl.value;
    if (!search) {
      this.filteredProductos.next(this.listaProductos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the clientes
    this.filteredProductos.next(
      this.listaProductos.filter(
        (producto) => producto.pro_nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }
  onProductoChange(event) {
    this.productoSeleccionado = event.value;
    this.productoParaFactura = {
      cantidad: 0,
      pro_iva: this.productoSeleccionado.pro_iva,
      pro_pvp: parseFloat(this.productoSeleccionado.pro_pvp),
      prod_id: this.productoSeleccionado.pro_id,
      pro_nombre: this.productoSeleccionado.pro_nombre,
      total: 0,
    };
  }
  onAgregarProductoAlDetalle() {
    if (
      this.productoParaFactura.cantidad > this.productoSeleccionado.pro_stock
    ) {
      this.showNotification("warning", "Stock no disponible.");
      return;
    }
    if (this.productoParaFactura.cantidad === 0) {
      this.showNotification("warning", "La cantidad debe ser mayor a cero.");
      return;
    }
    if (
      this.productosFacturaDetalle.find(
        (p) => p.prod_id === this.productoParaFactura.prod_id
      )
    ) {
      this.showNotification("warning", "El producto ya se ha agregado.");
      return;
    }
    this.productoParaFactura.total =
      this.productoParaFactura.cantidad * this.productoParaFactura.pro_pvp;
    this.productosFacturaDetalle.push(
      JSON.parse(JSON.stringify(this.productoParaFactura))
    );
    this.subtotalFactura = 0;
    this.ivaFactura = 0;
    this.totalFactura = 0;
    this.productosFacturaDetalle.map((p) => {
      this.subtotalFactura = this.subtotalFactura + p.total;
      p.pro_iva ? (this.ivaFactura = this.ivaFactura + p.total * 0.12) : "";
    });
    this.totalFactura = this.subtotalFactura + this.ivaFactura;
  }
  deleteProductoFactura(producto: ProductoFactura) {
    this.productosFacturaDetalle = this.productosFacturaDetalle.filter(
      (p) => p.prod_id !== producto.prod_id
    );
    this.subtotalFactura = 0;
    this.ivaFactura = 0;
    this.totalFactura = 0;
    this.productosFacturaDetalle.map((p) => {
      this.subtotalFactura = this.subtotalFactura + p.total;
      p.pro_iva ? (this.ivaFactura = this.ivaFactura + p.total * 0.12) : "";
    });
    this.totalFactura = this.subtotalFactura + this.ivaFactura;
  }
  createFactura() {
    const nuevaFactura: FacturaSave = {
      nro_factura: this.nroFactura,
      cliente_cedula: this.clienteSeleccionado.cedula,
      tipo_pago: this.tipoPago,
      fecha: this.fechaFactura,
      subtotal: this.subtotalFactura,
      iva: this.ivaFactura,
      total: this.totalFactura,
      estado: true,
      detalle: this.productosFacturaDetalle,
    };
    this.facturasService.createFactura(nuevaFactura).subscribe(
      (data) => {
        this.showNotification("success", "Factura creado con éxito");
        this.createFacturaData = {
          id: 0,
          nro_factura: "",
          cliente_cedula: "",
          tipo_pago: "efectivo",
          fecha: "",
          subtotal: 0,
          iva: 0,
          total: 0,
          estado: true,
        };
        this.router.navigate(["/facturas"]);
        this.onDownloadInvoice(data);
      },
      (error) => {
        this.showNotification("danger", "No se puedo crear el factura.");
        console.log("error 💔", error);
      }
    );
  }
  onDownloadInvoice(factura: Factura) {
    const link = document.createElement("a");
    link.href = `https://api-facturacion-utn.herokuapp.com/facturas-pdf/${factura.id}`;
    link.target = "_blank";
    link.click();
  }
}
