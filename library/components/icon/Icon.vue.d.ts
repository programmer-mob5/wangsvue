export type WangsIconseverities =
  | 'danger'
  | 'info'
  | 'warning'
  | 'primary'
  | 'success'
  | 'secondary';

/**
 * List of all available icons.
 */
export type WangsIcons =
  | 'add'
  | 'arrow-down'
  | 'arrow-drop-down'
  | 'arrow-go-back'
  | 'arrow-up-s'
  | 'arrow-up-down'
  | 'arrow-left'
  | 'arrow-left-double'
  | 'arrow-left-right'
  | 'arrow-right'
  | 'arrow-right-double'
  | 'arrow-right-fill'
  | 'asset-view'
  | 'assignment'
  | 'audit'
  | 'bell'
  | 'bell-alert'
  | 'borrow'
  | 'building'
  | 'building-4'
  | 'calendar'
  | 'calendar-todo'
  | 'chat-check'
  | 'change-tag'
  | 'check'
  | 'checkbox-circle'
  | 'checkbox-circle-fill'
  | 'checkbox-blank-circle'
  | 'close'
  | 'close-circle'
  | 'coins'
  | 'completion'
  | 'dashboard'
  | 'delete-back'
  | 'delete-bin'
  | 'delete-bin-7'
  | 'device'
  | 'disposal'
  | 'download'
  | 'dropbox'
  | 'dragable-menu'
  | 'edit'
  | 'ellipsis-h'
  | 'emotion-happy-fill'
  | 'emotion-unhappy-fill'
  | 'error'
  | 'exchange'
  | 'extension-borrow'
  | 'eye'
  | 'eye-off'
  | 'flag'
  | 'file-copy'
  | 'file-edit'
  | 'file-history'
  | 'file-info'
  | 'files'
  | 'file-list-2'
  | 'file-list'
  | 'file-settings'
  | 'file-shield-2'
  | 'filter-fill'
  | 'filter'
  | 'folder'
  | 'group'
  | 'hand-coin'
  | 'handheld'
  | 'history'
  | 'image-add'
  | 'indeterminate-circle-fill'
  | 'info'
  | 'link-unlink-m'
  | 'list-settings'
  | 'loader-4'
  | 'logout-box-r'
  | 'mail-open'
  | 'mail-send'
  | 'map-2'
  | 'map-pin'
  | 'menu'
  | 'menu-unfold'
  | 'more'
  | 'move-to'
  | 'node-tree'
  | 'note'
  | 'notification'
  | 'pair-tag'
  | 'pencil'
  | 'phone'
  | 'printer'
  | 'price-tag-3'
  | 'profile'
  | 'qr'
  | 'qr-scan'
  | 'refresh'
  | 'replace-tag'
  | 'report-tag'
  | 'repair-ticketing'
  | 'rfid'
  | 'round-keyboard-arrow-left'
  | 'round-keyboard-arrow-right'
  | 'round-keyboard-double-arrow-left'
  | 'round-keyboard-double-arrow-right'
  | 'search'
  | 'search-line'
  | 'search-eye'
  | 'settings'
  | 'shopping-cart-2'
  | 'smartphone'
  | 'sort-asc'
  | 'sort-desc'
  | 'spinner'
  | 'stack'
  | 'store'
  | 'subtract'
  | 'time'
  | 'tools'
  | 'tracking'
  | 'unassign'
  | 'upload-2'
  | 'upload-cloud-2'
  | 'user'
  | 'user-add'
  | 'user-follow'
  | 'user-search'
  | 'user-settings'
  | 'verification';

export interface IconProps {
  icon: WangsIcons;
  severity?: WangsIconseverities;
  /**
   * Show info on hover.
   */
  info?: string;
  /**
   * Set the position of tooltip.
   */
  tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class?: any;
}
