export { default as Strings } from './Strings'
export { default as Colors } from './Colors'
export * from './Api'
export * from './Menu'
export * from './Routes'
export {
  getMenuTree,
  getMenuEntriesForPermissionMatrix,
  getPermissionKeyByPath,
  getAllPermissionKeys,
  buildMenuPermissions,
  MENU_ENTRIES
} from './MenuConfig'
export type { MenuEntryI, MenuItemConfigI } from './MenuConfig'
