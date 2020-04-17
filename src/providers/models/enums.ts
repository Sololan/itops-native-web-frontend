/**
 * store中mutations的key
 */
export enum Mutations {
  SetMenuHide = 'setMenuHide',
  SetUserInfo = 'setUserInfo',
  SetLoadingShow = 'setLoadingShow',
  SetLoadingFullScreen = 'setLoadingFullScreen',
  SetDefault = 'setDefault',
}

/**
 * 常用日期格式化
 */
export enum DateFormat {
  Date = 'yyyy-MM-dd',
  DateTime = 'yyyy-MM-dd HH:mm',
  DateTimeFull = 'yyyy-MM-dd HH:mm:ss',
}

/**
 *  网关配置
 */
export enum Gateway {
  Bs = 'bs',
  Uc = 'uc',
  Adapter = 'adapter',
}

/**
 * http请求方式
 */
export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE
}

/**
 * storage的key
 */
export enum StorageKey {
  Token = 'token',
  UserName = 'userName',
  UserInfo = 'userInfo',
}

/**
 * 消息类型
 */
export enum NoticeType {
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

/**
 * Table 的尺寸
 */
export enum TableSize {
  Medium = 'medium',
  Small = 'small',
  Mini = 'mini',
}

/**
 * tooltip effect 属性
 */
export enum TooltipEffect {
  Dark = 'dark',
  Light = 'light'
}

/**
 * 排序命令
 */
export enum SortOrder {
  Asc = 'ascending',
  Desc = 'descending'
}

/**
 * 对应列的类型
 */
export enum ColumnType {
  Selection = 'selection',
  Index = 'index',
  Expand = 'expand',
}

/**
 * 固定列类型
 */
export enum FixedType {
  Left = 'left',
  Right = 'right'
}

/**
 * 列对齐方式
 */
export enum ColumnAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

/**
 * 对应列是否可以排序
 */
export enum Sortable {
  Custom = 'custom'
}

/**
 * 过滤弹出框的定位
 */
export enum FilterPlacement {
  Top = 'top',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  Bottom = 'bottom',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  Left = 'left',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
  Right = 'right',
  RightStart = 'right-start',
  RightEnd = 'right-end'
}

/**
 * 组件布局，子组件名用逗号分隔
 */
export enum PageLayout {
  Sizes = 'sizes',
  Prev = 'prev',
  Pager = 'pager',
  Next = 'next',
  Jumper = 'jumper',
  Arrow = '->',
  Total = 'total',
  Slot = 'slot'
}

/**
 * 资源类型
 */
export enum ResourceType {
  Menu = '1', // 菜单
  Operate = '2' // 操作
}

/**
 * 菜单展示模式
 */
export enum MenuMode {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

/**
 * 子菜单打开的触发方式
 */
export enum MenuTrigger {
  Hover = 'hover',
  Click = 'click',
}

/**
 *  是否状态
 */
export enum YesOrNoStatus {
  No,  // 否
  Yes  // 是
}

/**
 * 字典组key
 */
export enum DictGroupKey {
  NoticeWay = 'NOTICE_WEY', // 通知方式
  WarningLevel = 'WARNING_LEVEL', // 告警级别
  WarningStage = 'WARNING_STAGE', // 告警阶段
  PostponementStrategy = 'POSTPONEMENT_STRATEGY', // 延迟策略
  Brand = 'BRAND',  // 设备品牌
  Supplier = 'SUPPLIER',  // 供应商
  EquipmentType = 'EQUIPMENT_TYPE', // 设备类型
  EquipmentSubType = 'EQUIPMENT_SUB_TYPE', // 设备子类型
  EquipmentUse = 'EQUIPMENT_USE', // 设备用途
}

/**
 * 监控类型code
 */
export enum MonitorTypeCode {
  Hardware = 'HARDWARE',  // 硬件监控
  Os = 'OS',  // 操作系统
  Database = 'DATABASE',  // 数据库
  Middleware = 'MIDDLEWARE',  // 中间件
  Web = 'web',  // web
}

/**
 * CRUD
 */
export enum CRUD {
  Create,
  Update
}

/**
 * 设备子类型（字典项key）
 */
export enum EquipmentSubTypeKey {
  Server = 'server',  // 服务器
  Workstation = 'workstation',  // 工作站
  Router = 'router',  // 路由器
  Firewall = 'firewall',  // 防火墙
  Interchanger = 'interchanger',  // 交换机
  Storage = 'storage',  // 存储
}

/**
 * 图表类型
 */
export enum MonitorChartType {
  Line = 1, // 折线图
  Bar,  // 柱状图
  Pie,  // 饼图
  Switch,  // 开关图表
  Text,  // 文本显示
}

export enum RoleCode {
  Admin = 'ROLE_ADMIN',
  Manager = 'ROLE_MANAGER',
  User = 'ROLE_USER',
}
