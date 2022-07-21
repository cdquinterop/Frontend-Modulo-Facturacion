import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { Cliente } from "app/clientes/clientes.component";
import { ClientesService } from "app/services/clientes.service";
import { FacturasService } from "app/services/facturas.service";
import { ReplaySubject, Subject, takeUntil } from "rxjs";
declare var $: any;

export interface Factura {
  id: number;
  nro_factura: string;
  cliente_cedula: string;
  tipo_pago: "credito" | "efectivo";
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: boolean;
}

declare interface TableData {
  headerRow: string[];
  dataRows: Factura[];
}
export interface Producto {
  pro_id: number;
  pro_nombre: string;
  pro_descripcion: string;
  pro_iva: boolean;
  pro_costo: string;
  pro_pvp: string;
  pro_imagen: string;
  pro_stock: number;
  pro_categoria: ProCategoria;
}

export interface ProCategoria {
  cat_id: number;
  cat_nombre: string;
}

@Component({
  selector: "app-facturas",
  templateUrl: "./facturas.component.html",
  styleUrls: ["./facturas.component.scss"],
})
export class FacturasComponent implements OnInit {
  public tableData1: TableData;
  public selectFactura: Factura = {
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

  displayStyle = "none";
  displayStyleCreate = "none";
  pageSize = 10;
  page = 1;
  constructor(
    private facturasService: FacturasService,
    private clienteService: ClientesService
  ) {}

  ngOnInit(): void {
    this.getFacturas();
    this.tableData1 = {
      headerRow: [
        "Nro. Factura",
        "Cédula Cliente",
        "Tipo de Pago",
        "Fecha",
        "Subtotal",
        "Iva",
        "Total",
        "Estado",
        "Acciones",
      ],
      dataRows: [],
    };
  }

  getFacturas() {
    this.facturasService.getFacturas().subscribe(
      (data) => {
        this.tableData1.dataRows = data;
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
  }

  deleteFactura(factura: Factura) {
    this.facturasService.deleteFactura({ ...factura, estado: false }).subscribe(
      (data) => {
        this.showNotification("success", "Factura anulada con éxito");
        this.getFacturas();
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
  }
  updateFactura() {
    this.facturasService.updateFactura(this.selectFactura).subscribe(
      (data) => {
        this.showNotification("success", "Factura actualizado con éxito");
        this.selectFactura = {
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
        this.getFacturas();
        this.displayStyle = "none";
      },
      (error) => {
        this.showNotification("danger", "No se puedo actualizar el factura.");
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

  openPopupEdit(factura: Factura) {
    let date = new Date(factura.fecha);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    console.log(dateString);
    this.selectFactura = {
      ...factura,
      fecha: dateString,
    };

    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }
  openPopupCreate() {
    this.displayStyleCreate = "block";
  }
  closePopupCreate() {
    this.displayStyleCreate = "none";
  }
  onDownloadReport() {
    const link = document.createElement("a");
    link.href = "https://api-facturacion-utn.herokuapp.com/facturas-resporte";
    link.target = "_blank";
    link.click();
  }
  onDownloadInvoice(factura: Factura) {
    const link = document.createElement("a");
    link.href = `https://api-facturacion-utn.herokuapp.com/facturas-pdf/${factura.id}`;
    link.target = "_blank";
    link.click();
  }
}
