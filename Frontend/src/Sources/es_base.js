export default {
  navPaths: {
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
    cancel: "Cancelar",
    search: "Buscar...",
    save: "Guardar",
    add: "Añadir",
    searchInput: "Buscar...",
    images: "Imagenes",
    noItems: "No hay elementos",
    delete: "Eliminar",
    edit: "Editar",
    see: "Ver",
    sure: "¿Estas seguro?",
    imSure: "Estoy seguro",
    pleaseConfirm: "Por favor confirme",
    deletedSuccess: "Eliminado correctamente",
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
      id: "ID",
      name: "Nombre",
      quantity: "Cantidad",
      status: "Estado",
      addProduct: "Añadir Producto",
    },
    placeholder: {
      quantityEntry: "Ingrese una cantidad para ingresar",
      provider: "Seleccione un proveedor",
      product: "Seleccione un producto",
      images: "Seleccione las imagenes",
      description: "Escriba una descripción",
    },
    labels: {
      product: "Producto",
      code: "Codigo",
      quantity: "Cantidad",
      provider: "Proveedor",
      description: "Descripción",
    },
    entry: "Entrada de Inventario",
    output: "Salida de Inventario",
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
        barcode: "Escriba el código de barras del producto (Opcional)",
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
