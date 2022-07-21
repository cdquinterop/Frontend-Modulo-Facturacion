import { Component, OnInit } from "@angular/core";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { ClientesService } from "app/services/clientes.service";
declare var $: any;
import Swal from "sweetalert2";
import { validateForm } from "./FormValidation";

export interface Cliente {
  cedula: string;
  nombre: string;
  fecha_nacimiento: string;
  tipo_cliente: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: boolean;
  eliminado: boolean;
}
declare interface TableData {
  headerRow: string[];
  dataRows: Cliente[];
}

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
})
export class ClientesComponent implements OnInit {
  public tableData1: TableData;
  public listaClientes: Cliente[] = [];
  public selectCliente: Cliente = {
    cedula: "",
    nombre: "",
    fecha_nacimiento: "",
    tipo_cliente: "",
    direccion: "",
    telefono: "",
    email: "",
    estado: false,
    eliminado: false,
  };
  public createClienteData: Cliente = {
    cedula: "",
    nombre: "",
    fecha_nacimiento: "",
    tipo_cliente: "",
    direccion: "",
    telefono: "",
    email: "",
    estado: true,
    eliminado: false,
  };
  displayStyle = "none";
  displayStyleCreate = "none";
  buscarPor = "cedula";
  buscarPorData = "";
  pageSize = 10;
  page = 1;
  validationRules = {
    required: ["cedula", "nombre", "telefono", "email"],
    length: [
      {
        field: "cedula",
        min: 10,
      },
      {
        field: "cedula",
        max: 10,
      },
      {
        field: "telefono",
        min: 10,
      },
      {
        field: "telefono",
        max: 10,
      },
    ],
    document: [
      {
        field: "cedula",
        type: "CI",
      },
    ],
    email: ["email"],
    number: ["telefono"],
    noNumber: ["nombre"],
  };
  errors = {
    cedula: null,
    nombre: null,
    telefono: null,
    email: null,
  };

  constructor(
    private clienteService: ClientesService,
    config: NgbPaginationConfig
  ) {
    config.size = "sm";
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getClientes();
    this.tableData1 = {
      headerRow: [
        "Cédula",
        "Nombre",
        "F. Nacimiento",
        "T. Cliente",
        "Dirección",
        "Teléfono",
        "Email",
        "Estado",
        "Acciones",
      ],
      dataRows: [],
    };
  }
  onSearchCliente(event) {
    switch (this.buscarPor) {
      case "cedula":
        this.tableData1.dataRows = this.listaClientes.filter((item) =>
          item.cedula.toLowerCase().includes(this.buscarPorData.toLowerCase())
        );
        break;
      case "nombre":
        this.tableData1.dataRows = this.listaClientes.filter((item) =>
          item.nombre.toLowerCase().includes(this.buscarPorData.toLowerCase())
        );
        break;
      case "tipo_cliente":
        this.tableData1.dataRows = this.listaClientes.filter((item) =>
          item.tipo_cliente
            .toLowerCase()
            .includes(this.buscarPorData.toLowerCase())
        );
        break;
      case "email":
        this.tableData1.dataRows = this.listaClientes.filter((item) =>
          item.email.toLowerCase().includes(this.buscarPorData.toLowerCase())
        );
        break;

      default:
        break;
    }
  }
  getClientes() {
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.tableData1.dataRows = data;
        this.listaClientes = data;
      },
      (error) => {
        console.log("error 💔", error);
      }
    );
  }
  async deleteCliente(cliente: Cliente) {
    console.log("cliente 🎉", cliente);
    Swal.fire({
      title: "¿Estas seguro de realizar esta acción?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService
          .deleteCliente({ ...cliente, estado: false })
          .subscribe(
            (data) => {
              this.showNotification("success", "Cliente eliminado con éxito");
              this.getClientes();
            },
            (error) => {
              console.log("error 💔", error);
              const { message } = error.error || {};
              this.showNotification(
                "danger",
                message
                  ? message
                  : "No se pudo eliminar el cliente. Por favor intenta de nuevo"
              );
            }
          );
      }
    });
  }
  updateCliente() {
    this.clienteService.updateCliente(this.selectCliente).subscribe(
      (data) => {
        this.showNotification("success", "Cliente actualizado con éxito");
        this.selectCliente = {
          cedula: "",
          nombre: "",
          fecha_nacimiento: "",
          tipo_cliente: "",
          direccion: "",
          telefono: "",
          email: "",
          estado: true,
          eliminado: false,
        };
        this.getClientes();
        this.displayStyle = "none";
      },
      (error) => {
        this.showNotification("danger", "No se puedo actualizar el cliente.");
        console.log("error 💔", error);
      }
    );
  }
  validForm = () => {
    const errors = validateForm(
      {
        cedula: this.createClienteData.cedula,
        nombre: this.createClienteData.nombre,
        telefono: this.createClienteData.telefono,
        email: this.createClienteData.email,
      },
      this.validationRules
    );
    const validForm = Object.keys(errors).length;
    this.errors = errors;
    return !validForm;
  };
  createCliente() {
    if (!this.validForm()) {
      return;
    }
    this.clienteService.createCliente(this.createClienteData).subscribe(
      (data) => {
        this.showNotification("success", "Cliente creado con éxito");
        this.createClienteData = {
          cedula: "",
          nombre: "",
          fecha_nacimiento: "",
          tipo_cliente: "",
          direccion: "",
          telefono: "",
          email: "",
          estado: false,
          eliminado: false,
        };
        this.getClientes();
        this.displayStyleCreate = "none";
      },
      (error) => {
        this.showNotification("danger", "No se puedo crear el cliente.");
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

  openPopupEdit(cliente: Cliente) {
    let date = new Date(cliente.fecha_nacimiento);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    this.selectCliente = {
      ...cliente,
      fecha_nacimiento: dateString,
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

  onSaveClienteStatus(cliente: Cliente) {
    console.log("cliente 👻", cliente);
    this.clienteService
      .updateCliente({ ...cliente, estado: !cliente.estado })
      .subscribe(
        (data) => {
          this.showNotification("success", "Cliente actualizado con éxito");
          this.getClientes();
          this.displayStyle = "none";
        },
        (error) => {
          this.showNotification("danger", "No se puedo actualizar el cliente.");
          console.log("error 💔", error);
        }
      );
  }
  onDownloadReport() {
    const link = document.createElement("a");
    link.href = "https://api-facturacion-utn.herokuapp.com/clientes-resporte";
    link.target = "_blank";
    link.click();
  }
}
