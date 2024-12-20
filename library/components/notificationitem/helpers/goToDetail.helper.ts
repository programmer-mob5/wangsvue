import { navigateToUrl } from 'single-spa';
import { NotificationItemType } from '../NotificationItem.vue.d';

export const goToAccountMember = (notification: NotificationItemType): void => {
  switch (notification.title.toLowerCase()) {
    case 'reminder: ganti password skenario testing':
      navigateToUrl('/tim-member/akun-member/akun-skenario-testing');
      break;
    case 'reminder: ganti password akun performance testing':
      navigateToUrl('/tim-member/akun-member/akun-performance-testing');
      break;
    case 'reminder: ganti password akun figma & github':
    default:
      navigateToUrl('/tim-member/akun-member/akun-member');
      break;
  }
};

export const goToQC = (notification: NotificationItemType): void => {
  sessionStorage.setItem('projectId', notification.data.projectId as string);
  sessionStorage.setItem(
    'subModuleId',
    notification.data.subModuleId as string,
  );
  navigateToUrl(
    `/proyek/detail-proyek/quality-control/e2e-testing/pending-e2e-testing-${notification.data.platform}/end-to-end-testing`,
  );
};

export const goToProject = (notification: NotificationItemType): boolean => {
  let url: string;
  if (notification.data.ticketId)
    navigateToUrl(
      `/ticket/task-ticket/detail-ticket/${notification.data.ticketId}`,
    );
  else if (notification.data.projectId) {
    sessionStorage.setItem('projectId', notification.data.projectId);
    if (notification.data.moduleId) {
      url = `/proyek/detail-proyek/modul/${notification.data.moduleId}/detail-modul`;
      if (notification.module === 'Comment') url += '/komentar';
      navigateToUrl(url);
      return false;
    }
    if (notification.data.subModuleId) {
      url = `/proyek/detail-proyek/sub-modul/${notification.data.subModuleId}/detail-sub-modul`;
      if (notification.module === 'Comment') url += '/komentar';
      navigateToUrl(url);
      return false;
    }
    if (notification.data.taskId) return true;
    navigateToUrl('/proyek/detail-proyek/tim');
  }
  return false;
};

export const goToProjectList = (notification: NotificationItemType): void => {
  if (
    [
      'proyek telah diedit',
      'perubahan nilai prioritas proyek',
      'perubahan proyek manager',
    ].includes(notification.title.toLowerCase())
  ) {
    if (notification.data.projectId) {
      sessionStorage.setItem('projectId', notification.data.projectId);
      sessionStorage.setItem('openProjectId', notification.data.projectId);
    }
    navigateToUrl('/proyek/daftar-proyek');
  } else goToProject(notification);
};
