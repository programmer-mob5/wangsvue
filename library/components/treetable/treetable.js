export default {
  root: {
    'class': [
      'overflow-auto relative',
      'rounded-lg rounded-br-none rounded-bl-none',
    ],
    'data-wv-name': 'treetable',
    'data-wv-section': 'root',
    'style': 'scrollbar-width: none',
  },
  table: {
    'class': [
      'min-w-max w-full',
      '!border-separate !border-spacing-0 border !border-solid !border-primary-100 !border-t-0 !border-l-0 !border-r-0 !rounded-lg',
    ],
    'data-wv-section': 'table',
  },
  tbody: {
    class: [
      '[&_tr:last-of-type>td]:!border-b-0',
      '[&_tr:last-of-type>td:last-child]:!rounded-br-lg',
      '[&_tr:last-of-type>td:first-child]:!rounded-bl-lg',
    ],
  },
  headercell: {
    'class': 'text-xs font-semibold text-white bg-primary-400 p-2 text-left',
    'data-wv-section': 'headercell',
  },
  headercheckbox: {
    'class': '',
    'data-wv-section': 'headercheckbox',
  },
  rowcheckbox: {
    'class': '',
    'data-wv-section': 'rowcheckbox',
  },
  bodycell: {
    'class': 'text-xs px-2 py-1.5',
    'data-wv-section': 'bodycell',
  },
};
