import validator from "validator";
import { ccValidator } from "./ccValidator";

export const validateForm = (form: any, validationRules: any) => {
  const errors: any = {};

  for (const rule in validationRules) {
    if (validationRules.hasOwnProperty(rule)) {
      switch (rule) {
        case "required":
          validationRules[rule].forEach((item: any) => {
            if (!form[item] || validator.isEmpty(form[item].toString())) {
              errors[item] = "Este campo es requerido.";
            }
          });
          break;

        case "email":
          validationRules[rule].forEach((item: any) => {
            if (
              !validator.isEmpty(form[item]) &&
              !validator.isEmail(form[item])
            ) {
              errors[item] = "Ingresa un correo electrónico válido";
            }
          });
          break;

        case "assertive":
          validationRules[rule].forEach((item: any) => {
            if (form[item] !== true) {
              errors[item] = "Este campo es requerido.";
            }
          });
          break;

        case "length":
          validationRules[rule].forEach((item: any) => {
            if (typeof item === "object") {
              if (
                !validator.isLength(form[item.field], { min: item.min }) &&
                item.min
              ) {
                errors[
                  item.field
                ] = `El tamaño de este campo debe ser mínimo ${item.min} caracteres.`;
              }
              if (
                !validator.isLength(form[item.field], { max: item.max }) &&
                item.max
              ) {
                errors[
                  item.field
                ] = `El tamaño de este campo debe ser máximo ${item.max} caracteres.`;
              }
            }
          });
          break;

        case "number":
          const numberRegex = /[^0-9]+/;
          validationRules[rule].forEach((item: any) => {
            if (numberRegex.exec(form[item]) !== null) {
              errors[item] = "Este campo debe ser numérico";
            }
          });
          break;

        case "noNumber":
          const noNumberRegex = /[0-9]+/;
          validationRules[rule].forEach((item: any) => {
            if (noNumberRegex.exec(form[item]) !== null) {
              errors[item] = "Este campo no puede contener números";
            }
          });
          break;

        case "noSpecialCharacters":
          const noSpecialCharactersRegex =
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
          validationRules[rule].forEach((item: any) => {
            if (noSpecialCharactersRegex.exec(form[item]) !== null) {
              errors[item] =
                "Este campo no puede contener caracteres especiales";
            }
          });
          break;

        case "passwordConfirm":
          validationRules[rule].forEach((item: any) => {
            const password = Object.keys(item)[0];
            const passwordConfirm = item[password];
            const currentPassword = Object.keys(item)[1];

            if (
              form[currentPassword] ||
              form[password] ||
              form[passwordConfirm]
            ) {
              if (!form[currentPassword])
                errors[currentPassword] = "This field is required";
              if (!form[password]) errors[password] = "This field is required";
              if (!form[passwordConfirm])
                errors[passwordConfirm] = "This field is required";
              if (form[password] && !form[passwordConfirm]) {
                errors[passwordConfirm] = "Confirma la contraseña";
              } else if (
                form[password] &&
                form[passwordConfirm] &&
                form[password] !== form[passwordConfirm]
              ) {
                errors[passwordConfirm] = "Las contraseñas no coinciden";
              }
            }
          });
          break;
        case "creditCard":
          validationRules[rule].forEach((item: any) => {
            if (!ccValidator(form[item])) {
              errors[item] = "Número de tarjeta inválido";
            }
          });
          break;
        case "document":
          validationRules[rule].forEach((item: any) => {
            if (typeof item === "object" && item.type === "CI") {
              if (!validateDocument(form[item.field], item.type)) {
                errors[item.field] = "Cédula inválida";
              }
            }
          });
          break;

        default:
          break;
      }
    }
  }

  return errors;
};

const UtilIdetification = {
  esCedulaPersonaNatural: function (identificacion: string) {
    if (identificacion.length === 10) {
      return true;
    }
    return false;
  },
  esRucPersonaNatural: function (identificacion: string) {
    if (
      identificacion.length === 13 &&
      identificacion.charAt(2) !== "6" &&
      identificacion.charAt(2) !== "9" &&
      identificacion.substring(10, 13) === "001"
    ) {
      return true;
    }
    return false;
  },
  ultimosDigitosRuc: function (identificacion: string) {
    if (
      identificacion.length === 13 &&
      identificacion.substring(10, 13) === "001"
    ) {
      return true;
    }
    return false;
  },
  esRucPersonaJuridica: function (identificacion: string) {
    if (
      this.ultimosDigitosRuc(identificacion) &&
      identificacion.charAt(2) === "9"
    ) {
      return true;
    }
    return false;
  },
  esRucEmpresaPublica: function (identificacion: string) {
    if (
      this.ultimosDigitosRuc(identificacion) &&
      identificacion.charAt(2) === "6"
    ) {
      return true;
    }
    return false;
  },
  validarCedula: function (identificacion: string, coeficientes: number[]) {
    const id = identificacion;
    let sumaDigitosPorCoeficiente = 0;
    let valor = 0;
    for (let i = 0; i < coeficientes.length; i++) {
      const digito = parseInt(id.charAt(i)) * 1;
      valor = coeficientes[i] * digito;
      if (valor > 9) {
        valor = valor - 9;
      }
      sumaDigitosPorCoeficiente = sumaDigitosPorCoeficiente + valor;
    }
    let modulo = sumaDigitosPorCoeficiente % 10;
    modulo = modulo === 0 ? 10 : modulo;
    const resultado = 10 - modulo;
    const ultimoDigito = parseInt(id.charAt(9)) * 1;
    if (resultado === ultimoDigito) {
      return true;
    }
    return false;
  },
  validarRUC: function (
    identificacion: string,
    coeficientes: number[],
    digitoVerificador: string
  ) {
    const id = identificacion;
    const verificador = parseInt(digitoVerificador) * 1;
    let sumaTotalDigitosPorCoeficiente = 0;
    let digito = 0;
    let valor = 0;
    for (let i = 0; i < coeficientes.length; i++) {
      digito = parseInt(id.charAt(i)) * 1;
      valor = coeficientes[i] * digito;
      sumaTotalDigitosPorCoeficiente = sumaTotalDigitosPorCoeficiente + valor;
    }
    const modulo = sumaTotalDigitosPorCoeficiente % 11;
    let resultado = 0;
    if (modulo !== 0) {
      resultado = 11 - modulo;
    }

    if (resultado === verificador) {
      return true;
    }
    return false;
  },
  esClienteFinal: function (identificacion: string) {
    if (identificacion === "9999999999999") {
      return true;
    }
    return false;
  },
  validarProvincia: function (identificacion: string) {
    if (parseInt(identificacion) <= 0 || parseInt(identificacion) > 24) {
      return false;
    }
    return true;
  },
};

function validateCI(document: string) {
  const coeficientesCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  return (
    UtilIdetification.validarProvincia(document.substring(0, 2)) &&
    UtilIdetification.esCedulaPersonaNatural(document) &&
    UtilIdetification.validarCedula(document, coeficientesCedula)
  );
}

function validateRUC(document: string) {
  const coeficientesCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const coeficientesRucPersonaJuridica = [4, 3, 2, 7, 6, 5, 4, 3, 2];
  const coeficientesRucEmpresaPublica = [3, 2, 7, 6, 5, 4, 3, 2];
  return (
    (UtilIdetification.esRucPersonaNatural(document) &&
      UtilIdetification.validarCedula(document, coeficientesCedula)) ||
    (UtilIdetification.esRucPersonaJuridica(document) &&
      UtilIdetification.validarRUC(
        document,
        coeficientesRucPersonaJuridica,
        document.charAt(9)
      )) ||
    (UtilIdetification.esRucEmpresaPublica(document) &&
      UtilIdetification.validarRUC(
        document,
        coeficientesRucEmpresaPublica,
        document.charAt(8)
      ))
  );
}

export const validateDocument = (document: string, type: string) => {
  if (type === "CI") {
    return validateCI(document);
  } else if (type === "RUC") {
    return validateRUC(document);
  } else if (type === "PASSPORT") {
    return true;
  }
  return false;
};
