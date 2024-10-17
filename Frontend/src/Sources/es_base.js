export default {
  navPaths: {
    home: "Inicio",
    products: "Productos",
    inventory: "Inventario",
    settings: "Opciones",
    supplier: "Proveedores",
    locations: "Ubicaciones",
  },
  dashboard: {
    products: "Productos",
    entries: "Entradas de Inventario",
    movements: "Movimientos de Inventario",
  },
  general: { 
    export: "Exportar",
    cancel: "Cancelar",
    searchInput: "Buscar...",
  },
  products: {
    new: "Nuevo producto",
    headers: {
      name: "Nombre",
      description: "Descripción",
      code: "Código",
      barCode: "Código de barras",
      originProduct: "Origen del producto",
      location: "Ubicación",
    },
    create: {
      labels: {
        title: "Título",
        description: "Descripción",
        code: "Código",
        barcode: "Código de Barras",
        origin: "Producto de Origen",
        location: "Ubicación",
      },
      validations: {
        code: {
          true: "El código es válido",
          false: "El código ya existe",
        }
      },
      placeholders: {
        title: "Escriba el título del producto",
        description: "Escriba la descripción del producto",
        origin: "Seleccione el origen del producto",
        location: "Seleccione la ubicación del producto",
        code: "Escriba el Código del producto",
        barcode: "Escriba el código de barras del producto (Opcional)",
      },
      general: "Información General",
    },
    createProductHeader: "Crear nuevo producto",
  }
};