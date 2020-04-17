export interface UserQueryModel {
  fullName?: string,
  includeAllOrg?: boolean,
  orgId?: number,
  orgIdList?: number[],
  skipRoleCodeList?: string[],
  username?: string
  roleId?: number
  startDate?: string
  endDate?: string
  phone?: string

}