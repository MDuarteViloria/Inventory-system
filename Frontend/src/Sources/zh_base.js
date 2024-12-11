export default {
  short: "zh",
  navPaths: {
    back: "返回",
    home: "首页",
    products: "产品",
    inventory: "库存",
    settings: "选项",
    providers: "供应商",
    locations: "位置",
    categories: "类别",
    origins: "起源",
    images: "图片",
    users: "用户",
    historial: "历史记录",
  },
  dashboard: {
    products: "产品",
    entries: "库存录入",
    movements: "库存移动",
  },
  general: {
    export: "导出",
    import: "导入",
    noImages: "没有图片",
    cancel: "取消",
    exit: "退出",
    search: "搜索...",
    save: "保存",
    add: "添加",
    searchInput: "搜索...",
    images: "图片",
    noItems: "没有项目",
    delete: "删除",
    edit: "编辑",
    error: "发生错误",
    see: "查看",
    sure: "你确定吗？",
    imSure: "我确定",
    pleaseConfirm: "请确认",
    deletedSuccess: "删除成功",
    images: "图片",
  },
  origins: {
    selfName: "起源",
    new: "新起源",
    edit: "编辑起源",
    general: {
      id: "ID",
      name: "名称",
    },
    create: {
      success: "起源已成功创建",
      validations: {
        badParams: "名称无效",
        editted: "起源已成功编辑",
      },
    },
  },
  providers: {
    selfName: "供应商",
    new: "新供应商",
    edit: "编辑供应商",
    general: {
      id: "ID",
      name: "名称",
      doc: "文件编号",
    },
    create: {
      success: "供应商已成功创建",
      validations: {
        badParams: "名称或文件编号无效",
        editted: "供应商已成功编辑",
      },
    },
  },
  inventory: {
    general: {
      seeEntry: "查看库存录入",
      seeOutput: "查看库存输出",
      seeMovement: "查看移动",
      id: "ID",
      name: "名称",
      type: "类型",
      quantity: "数量",
      user: "用户",
      status: "状态",
      searchOutputEntry: "按ID或用户搜索...",
      newEntry: "新库存录入",
      newOutput: "新库存输出",
      addProduct: "添加产品",
      date: "日期",
      seeImages: "查看图片",
    },
    edit: {
      editted: "编辑成功",
      badParams: "所有字段均为必填项",
    },
    placeholder: {
      quantityEntry: "输入要录入的数量",
      quantityOutput: "输入要输出的数量",
      provider: "选择供应商",
      product: "选择产品",
      details: "填写此录入的详细信息",
      images: "选择图片",
      description: "填写描述",
    },
    labels: {
      product: "产品",
      code: "代码",
      quantity: "数量",
      details: "详细信息",
      provider: "供应商",
      description: "描述",
      output: "库存输出",
      entry: "库存录入",
    },
    entryCreate: {
      success: "录入已成功创建",
      error: "创建录入时出错",
    },
    outputCreate: {
      success: "输出已成功创建",
      stock: "请求的数量不在库存中",
      quantity: "请求的数量必须大于0",
      error: "创建输出时出错",
    },
    entry: "库存录入",
    entries: "库存录入",
    output: "库存输出",
    outputs: "库存输出",
    historial: {
      entry: "录入",
      output: "输出",
    },
    stock: {
      true: "可用",
      false: "不可用",
    },
  },
  categories: {
    selfName: "类别",
    new: "新类别",
    edit: "编辑类别",
    general: {
      id: "ID",
      name: "名称",
    },
    create: {
      success: "类别已成功创建",
      validations: {
        badParams: "名称无效",
        editted: "类别已成功编辑",
      },
    },
  },
  login: {
    title: "登录",
    button: "进入",
    badLogin: "用户名或密码错误",
    error: "登录时出错",
    labels: {
      username: "用户名",
      password: "密码",
    },
  },
  locations: {
    selfName: "位置",
    new: "新位置",
    edit: "编辑位置",
    general: {
      id: "ID",
      name: "名称",
    },
    create: {
      success: "位置已成功创建",
      validations: {
        badParams: "名称无效",
        editted: "位置已成功编辑",
      },
    },
  },
  products: {
    search: "搜索产品",
    new: "新产品",
    headers: {
      name: "名称",
      description: "描述",
      code: "代码",
      barCode: "条形码",
      originProduct: "产品原产地",
      location: "位置",
    },
    selfName: "产品",
    create: {
      labels: {
        title: "标题",
        description: "描述",
        code: "代码",
        barcode: "条形码",
        origin: "产品原产地",
        location: "位置",
        images: "图片",
        categories: "类别",
      },
      validations: {
        code: {
          true: "代码有效",
          false: "代码已存在",
          notValid: "代码无效",
        },
        barcode: {
          true: "条形码有效",
          notValid: "条形码无效",
          false: "条形码已存在",
        },
        success: "产品已成功创建",
        badParams: "所有字段均为必填项",
        error: "创建产品时出错",
      },
      placeholders: {
        title: "填写产品标题",
        description: "填写产品描述",
        origin: "选择产品原产地",
        location: "选择产品位置",
        code: "填写产品代码",
        images: "选择图片",
        barcode: "填写产品条形码",
      },
      general: "基本信息",
    },
    edit: {
      labels: {
        title: "标题",
        description: "描述",
        code: "代码",
        barcode: "条形码",
        origin: "产品原产地",
        location: "位置",
        images: "图片",
        categories: "类别",
      },
      validations: {
        code: {
          true: "代码有效",
          false: "代码已存在",
          notValid: "代码无效",
        },
        barcode: {
          true: "条形码有效",
          notValid: "条形码无效",
          false: "条形码已存在",
        },
        success: "产品已成功编辑",
        error: "编辑产品时出错",
      },
      placeholders: {
        title: "填写产品标题",
        description: "填写产品描述",
        origin: "选择产品原产地",
        location: "选择产品位置",
        code: "填写产品代码",
        images: "选择图片",
        barcode: "填写产品条形码（可选）",
      },
      general: "基本信息",
    },
    createProductHeader: "创建新产品",
    editProductHeader: "编辑产品",
  },
  settings: {
    images: "图片",
    users: "用户",
    language: "语言",
  },
  images: {
    new: "添加图片",
    addedSuccess: "图片添加成功",
    sureDelete: "它将从所有产品、输出和录入中删除",
  },
  users: {
    selfName: "用户",
    new: "新用户",
    edit: "编辑用户",
    general: {
      id: "ID",
      fullname: "全名",
      username: "用户名",
      password: "密码",
    },
    placeholders: {
      fullname: "全名",
      username: "用户名",
      password: "密码，保持空白以保留",
      permissions: "权限",
    },
    permissions: {
      edit: "编辑权限",
      editted: "权限已成功编辑",
    },
    create: {
      success: "用户已成功创建",
      validations: {
        badParams: "名称或用户名无效",
        editted: "用户已成功编辑",
      },
    },
  },
  tables: {
    of: "的",
    results: "结果",
    pages: "页",
    prev: "上一页",
    next: "下一页",
  },
};
