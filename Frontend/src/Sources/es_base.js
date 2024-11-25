import { Button } from "@medusajs/ui";

export default {
  navPaths: {
    back: "Volver",
    home: "Inicio",
    products: "Productos",
    inventory: "Inventario",
    settings: "Opciones",
    providers: "Proveedores",
    locations: "Ubicaciones",
    categories: "Categorías",
    origins: "Origenes",
  },
  dashboard: {
    products: "Productos",
    entries: "Entradas de Inventario",
    movements: "Movimientos de Inventario",
  },
  general: {
    export: "Exportar",
    import: "Importar",
    noImages: "No hay imagenes",
    cancel: "Cancelar",
    exit: "Salir",
    search: "Buscar...",
    save: "Guardar",
    add: "Añadir",
    searchInput: "Buscar...",
    images: "Imagenes",
    noItems: "No hay elementos",
    delete: "Eliminar",
    edit: "Editar",
    error: "Ha ocurrido un error",
    see: "Ver",
    sure: "¿Estas seguro?",
    imSure: "Estoy seguro",
    pleaseConfirm: "Por favor confirme",
    deletedSuccess: "Eliminado correctamente",
    images: "Imagenes"
  },
  origins: {
    selfName: "Origen",
    new: "Nuevo origen",
    edit: "Editar origen",
    general: {
      id: "ID",
      name: "Nombre",
    },
    create: {
      success: "El origen se ha creado correctamente",
      validations: {
        badParams: "El nombre no es valido",
        editted: "El origen se ha editado correctamente"
      }
    }
  },
  providers: {
    selfName: "Proveedor",
    new: "Nuevo proveedor",
    edit: "Editar proveedor",
    general: {
      id: "ID",
      name: "Nombre",
      doc: "N. Documento",
    },
    create: {
      success: "El proveedor se ha creado correctamente",
      validations: {
        badParams: "El nombre o el N. Documento no es valido",
        editted: "El proveedor se ha editado correctamente"
      }
    }
  },
  inventory: {
    general: {
      seeEntry: "Visualizacion Entrada de Inventario",
      id: "ID",
      name: "Nombre",
      quantity: "Cantidad",
      user: "Usuario",
      status: "Estado",
      searchOutputEntry: "Buscar por ID o Usuario...",
      newEntry: "Nueva Entrada de Inventario",
      addProduct: "Añadir Producto",
      date: "Fecha",
      seeImages : "Ver Imagenes",
    },
    edit: {
      editted: "Editado con exito",
      badParams: "Todos los campos son obligatorios"
    },
    placeholder: {
      quantityEntry: "Ingrese una cantidad para ingresar",
      provider: "Seleccione un proveedor",
      product: "Seleccione un producto",
      details: "Escriba un detalle sobre este ingreso",
      images: "Seleccione las imagenes",
      description: "Escriba una descripción",
    },
    labels: {
      product: "Producto",
      code: "Codigo",
      quantity: "Cantidad",
      details: "Detalle",
      provider: "Proveedor",
      description: "Descripción",
    },
    entryCreate: {
      success: "La entrada se ha creado correctamente",
      error: "Error al crear la entrada",
    },
    entry: "Entrada de Inventario",
    entries: "Entradas de Inventario",
    output: "Salida de Inventario",
    outputs: "Salidas de Inventario",
    stock: {
      true: "Disponible",
      false: "No disponible",
    }
  },
  categories: {
    selfName: "Categoría",
    new: "Nueva categoría",
    edit: "Editar categoría",
    general: {
      id: "ID",
      name: "Nombre",
    },
    create: {
      success: "La categoría se ha creado correctamente",
      validations: {
        badParams: "El nombre no es valido",
        editted: "La categoría se ha editado correctamente"
      }
    }
  },
  login: {
    title: "Iniciar Sesión",
    button: "Iniciar Sesión",
    badLogin: "El usuario o la contraseña son incorrectos",
    error: "Error al iniciar sesión",
    labels: {
      username: "Usuario",
      password: "Contraseña",

    }
  },
  locations: {
    selfName: "Ubicación",
    new: "Nueva ubicación",
    edit: "Editar ubicación",
    general: {
      id: "ID",
      name: "Nombre",
    },
    create: {
      success: "La ubicacion se ha creado correctamente",
      validations: {
        badParams: "El nombre no es valido",
        editted: "La ubicacion se ha editado correctamente"
      }
    }
  },
  products: {
    search: "Buscar producto",
    new: "Nuevo producto",
    headers: {
      name: "Nombre",
      description: "Descripción",
      code: "Código",
      barCode: "Código de barras",
      originProduct: "Origen del producto",
      location: "Ubicación",
    },
    selfName: "Producto",
    create: {
      labels: {
        title: "Título",
        description: "Descripción",
        code: "Código",
        barcode: "Código de Barras",
        origin: "Producto de Origen",
        location: "Ubicación",
        images: "Imagenes",
        categories: "Categorías",
      },
      validations: {
        code: {
          true: "El código es válido",
          false: "El código ya existe",
          notValid: "El código no es válido",
        },
        barcode: {
          true: "El código de barras es válido",
          notValid: "El código de barras no es válido",
          false: "El código de barras ya existe",
        },
        success: "El producto se ha creado correctamente",
        badParams: "Todos los campos son obligatorios",
        error: "Error al crear el producto",
      },
      placeholders: {
        title: "Escriba el título del producto",
        description: "Escriba la descripción del producto",
        origin: "Seleccione el origen del producto",
        location: "Seleccione la ubicación del producto",
        code: "Escriba el Código del producto",
        images: "Seleccione las imagenes",
        barcode: "Escriba el código de barras del producto",
      },
      general: "Información General",
    },
    edit: {
      labels: {
        title: "Título",
        description: "Descripción",
        code: "Código",
        barcode: "Código de Barras",
        origin: "Producto de Origen",
        location: "Ubicación",
        images: "Imagenes",
        categories: "Categorías",
      },
      validations: {
        code: {
          true: "El código es válido",
          false: "El código ya existe",
          notValid: "El código no es válido",
        },
        barcode: {
          true: "El código de barras es válido",
          notValid: "El código de barras no es válido",
          false: "El código de barras ya existe",
        },
        success: "El producto se ha editado correctamente",
        error: "Error al editar el producto",
      },
      placeholders: {
        title: "Escriba el título del producto",
        description: "Escriba la descripción del producto",
        origin: "Seleccione el origen del producto",
        location: "Seleccione la ubicación del producto",
        code: "Escriba el Código del producto",
        images: "Seleccione las imagenes",
        barcode: "Escriba el código de barras del producto (Opcional)",
      },
      general: "Información General",
    },
    createProductHeader: "Crear nuevo producto",
    editProductHeader: "Editar producto",
  },
  tables: {
      of: "de",
      results: "resultados",
      pages: "paginas",
      prev: "Anterior",
      next: "Siguiente",
  }
};
