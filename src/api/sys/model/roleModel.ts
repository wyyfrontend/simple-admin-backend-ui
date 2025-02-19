import { BaseListResp } from '/@/api/model/baseModel';

/**
 *  @description: Role info response
 */
export interface RoleInfo {
  id: number;
  createdAt?: number;
  updatedAt?: number;
  status?: number;
  name?: string;
  value?: string;
  defaultRouter?: string;
  remark?: string;
  sort?: number;
}

/**
 *  @description: Role list response
 */

export type RoleListResp = BaseListResp<RoleInfo>;
