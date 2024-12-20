import useToast from './toast.util';
import { formatUserName, getInititalName } from './textFormatter.util';
import { checkRouteAccess } from './role.util';
import { formatDate, formatISODate, formatDateReadable } from './date.util';
import filterOptions from './filterOptions.util';
import exportToExcel from './exportToExcel.util';
import getImageURL from './getImageURL.util';
import genPlaceholder from './genPlaceholder.util';
import getStatusSeverity from './statusSeverity.util';
import getAttachmentIcon from './getAttachmentIcon.util';
import isEmptyObject from './object.util';
import getUser from './getUser.util';
import getUserType from './getUserType.util';
import getUserPermission from './getUserPermission.util';
import isIntersect from './isIntersect';
import convertJsonImage from './convertJsonImage.util';

const getNestedProperyValue = (
  object: object,
  property: string,
): string | boolean | number | object => {
  const properties = property.split('.');
  return properties.reduce((o, p) => o?.[p as keyof object], object);
};

const convertToArrayClass = (classes?: string | string[]): string[] => {
  if (!classes) return [];

  return Array.isArray(classes) ? classes : [classes];
};

export {
  checkRouteAccess,
  formatUserName,
  convertToArrayClass,
  getNestedProperyValue,
  useToast,
  exportToExcel,
  filterOptions,
  isEmptyObject,
  getImageURL,
  genPlaceholder,
  getInititalName,
  getStatusSeverity,
  getAttachmentIcon,
  getUser,
  getUserPermission,
  getUserType,
  isIntersect,
  convertJsonImage,
  formatDate,
  formatISODate,
  formatDateReadable,
};
