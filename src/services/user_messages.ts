// src/services/user_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_USER_CHANGE_STATUS,
  MSGTYPE_USER_PASSWORD,
  MSGTYPE_USER_CANCEL_ALL_ORDERS,
  MSG_TYPE_USER_FORCE_LOGOFF,
  MSG_TYPE_CHANGE_COORDINATOR,
  MSG_TYPE_CHANGE_BACKUP,
  MSGTYPE_USER_MODIFY,
  MSGTYPE_USER_CREATE,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_USER,
  JSON_KEY_PASSWORD,
  JSON_KEY_ROLE,
  JSON_KEY_FIRM,
  JSON_KEY_SUBMITTER,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
  JSON_KEY_COORDINATOR,
  JSON_KEY_BACKUP,
  JSON_KEY_CHECKPOINTER,
  JSON_KEY_TR_DELETE_REDUNDANT_ORDERS,
  JSON_KEY_PERMISSION,
  JSON_KEY_LISTENING_PORT,
  JSON_KEY_PROMETHEUS_PORT,
  JSON_KEY_DESCRIPTION,
} from '../common/common';

// -------- Status --------
// newStatus: 'A' | 'S'  (letter, same as markets/events)
// cancelAllOrders: 'Y' | 'N'
export function sendUserChangeStatus(
  userCode: string,
  newStatus: string,
  cancelAllOrders: 'Y' | 'N',
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_USER_CHANGE_STATUS,
    [JSON_KEY_USER]: userCode,
    [JSON_KEY_STATUS]: newStatus,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: cancelAllOrders,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Password --------
export function sendUserPassword(
  userCode: string,
  password: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_USER_PASSWORD,
    [JSON_KEY_USER]: userCode,
    [JSON_KEY_PASSWORD]: password,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Force Logoff --------
export function sendUserForceLogoff(
  userCode: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_USER_FORCE_LOGOFF,
    [JSON_KEY_USER]: userCode,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Cancel All Orders --------
export function sendUserCancelAllOrders(
  userCode: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_USER_CANCEL_ALL_ORDERS,
    [JSON_KEY_USER]: userCode,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Set Coordinator --------
export function sendUserChangeCoordinator(
  userCode: string,
  coordinator: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_CHANGE_COORDINATOR,
    [JSON_KEY_USER]: userCode,
    [JSON_KEY_COORDINATOR]: coordinator,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Set Backup --------
export function sendUserChangeBackup(
  userCode: string,
  backup: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_CHANGE_BACKUP,
    [JSON_KEY_USER]: userCode,
    [JSON_KEY_BACKUP]: backup,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Modify (for later) --------
export interface ModifyUserPayload {
  code: string;
  description: string;
  role: number;
  coordinator?: string;
  backup?: string;
  checkpointer?: string;
  deleteRedundantOrders?: string;
  permission?: number;
  status?: string;
  firm?: string;
  listeningPort?: number;
  prometheusPort?: number;
  submitter?: string;
}

export function sendUserModify(p: ModifyUserPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_USER_MODIFY,
    [JSON_KEY_USER]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_ROLE]: p.role,
  };

  if (p.coordinator !== undefined) payload[JSON_KEY_COORDINATOR] = p.coordinator;
  if (p.backup !== undefined) payload[JSON_KEY_BACKUP] = p.backup;
  if (p.checkpointer !== undefined) payload[JSON_KEY_CHECKPOINTER] = p.checkpointer;
  if (p.deleteRedundantOrders !== undefined) payload[JSON_KEY_TR_DELETE_REDUNDANT_ORDERS] = p.deleteRedundantOrders;
  if (p.permission !== undefined) payload[JSON_KEY_PERMISSION] = p.permission;
  if (p.status !== undefined) payload[JSON_KEY_STATUS] = p.status;
  if (p.firm) payload[JSON_KEY_FIRM] = p.firm;
  if (p.listeningPort !== undefined) payload[JSON_KEY_LISTENING_PORT] = p.listeningPort;
  if (p.prometheusPort !== undefined) payload[JSON_KEY_PROMETHEUS_PORT] = p.prometheusPort;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Create (for later) --------
export interface CreateUserPayload {
  code: string;
  description: string;
  role: number;
  password: string;
  coordinator?: string;
  backup?: string;
  checkpointer?: string;
  deleteRedundantOrders?: string;
  permission?: number;
  status?: string;
  firm?: string;
  listeningPort?: number;
  prometheusPort?: number;
  submitter?: string;
}

export function sendUserCreate(p: CreateUserPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_USER_CREATE,
    [JSON_KEY_USER]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_ROLE]: p.role,
    [JSON_KEY_PASSWORD]: p.password,
  };

  if (p.coordinator !== undefined) payload[JSON_KEY_COORDINATOR] = p.coordinator;
  if (p.backup !== undefined) payload[JSON_KEY_BACKUP] = p.backup;
  if (p.checkpointer !== undefined) payload[JSON_KEY_CHECKPOINTER] = p.checkpointer;
  if (p.deleteRedundantOrders !== undefined) payload[JSON_KEY_TR_DELETE_REDUNDANT_ORDERS] = p.deleteRedundantOrders;
  if (p.permission !== undefined) payload[JSON_KEY_PERMISSION] = p.permission;
  if (p.status !== undefined) payload[JSON_KEY_STATUS] = p.status;
  if (p.firm) payload[JSON_KEY_FIRM] = p.firm;
  if (p.listeningPort !== undefined) payload[JSON_KEY_LISTENING_PORT] = p.listeningPort;
  if (p.prometheusPort !== undefined) payload[JSON_KEY_PROMETHEUS_PORT] = p.prometheusPort;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}