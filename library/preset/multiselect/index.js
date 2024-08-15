import presetCheckbox from '../checkbox';

export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      'inline-flex',
      'relative',

      // Shape
      'w-full',
      // 'w-full md:w-56',
      // 'rounded-md',
      // 'shadow-sm',

      // Color and Background
      // 'bg-surface-0 dark:bg-surface-900',

      // States
      // {
      //   'ring-1 ring-inset ring-placeholder dark:ring-placeholder':
      //     !state.focused,
      //   'ring-2 ring-inset ring-primary-weak dark:ring-primary-weak':
      //     state.focused,
      // },

      // Misc
      'cursor-default',
      'select-none',
      { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled },
    ],
  }),
  labelContainer: {
    class:
      'overflow-hidden flex flex-auto items-center cursor-pointer py-[3px] px-3 pr-0',
  },
  label: ({ props }) => ({
    class: [
      'flex gap-1',

      // props.display === 'chip' && props?.modelValue?.length > 0

      'h-max',

      //Font
      'text-xs',
      {
        '!leading-5': props.modelValue == null,
      },

      //Shape
      'rounded-none',

      // Color
      {
        'text-general-200 dark:text-general-600 font-light':
          !props.modelValue?.length,
        'text-grayscale-800 dark:text-general-50 font-medium':
          props.modelValue?.length,
      },
      // {
      //   'text-surface-800 dark:text-surface-700': props.modelValue,
      //   'text-surface-400 dark:text-surface-500': !props.modelValue,
      // },
      // 'placeholder:text-surface-400 dark:placeholder:text-surface-500',

      // Transitions
      'transition duration-200',

      // Misc
      'overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis',
    ],
  }),
  token: {
    class: [
      // Flexbox
      'inline-flex items-center gap-1',

      // Spacing
      'py-1 px-2',

      // Shape
      'rounded-[50px]',

      'text-xs',
      'font-normal',
      'leading-[12px]',
      'tracking-[0.03em]',
      'items-center',

      'text-grayscale-900 dark:text-grayscale-900',
      'bg-grayscale-500 dark:bg-grayscale-500',
    ],
  },
  removeTokenIcon: {
    class: [
      // Shape
      'rounded-md leading-6',

      // Spacing
      'ml-2',

      // Size
      'w-4 h-4',

      // Transition
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer',
    ],
  },
  trigger: {
    class: [
      //Font
      // 'sm:text-sm',

      // Spacing
      'mr-1',

      // Flexbox
      'flex items-center justify-center',
      'shrink-0',

      // Color and Background
      'bg-transparent',
      'text-surface-500 dark:text-general-100',

      // Size
      'w-6',

      // Shape
      'rounded-tr-md',
      'rounded-br-md',
    ],
  },
  panel: {
    class: [
      // Position
      'absolute top-0 left-0',
      'mt-2',

      'max-w-[30vw]',

      // Shape
      'border-0',
      'rounded-lg',
      'shadow-panel',

      // Color
      'bg-surface-0 dark:bg-grayscale-900',
      'text-surface-800 dark:text-general-100',
      // 'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',
    ],
  },
  header: {
    class: [
      'flex items-center self-stretch justify-between gap-2',

      // Spacing
      'py-3 px-4',
      'm-0',

      //Shape
      'border-[0.5px] border-b-0',
      'rounded-tl-md',
      'rounded-tr-md',

      // Color
      'text-surface-700 dark:text-surface-700',
      'bg-primary-400 dark:bg-primary-400',
      'border-grayscale-900',
    ],
  },
  headerCheckboxContainer: {
    class: [
      'relative',

      // Alignment
      'inline-flex',
      'align-bottom',

      // Size
      'w-4',
      'h-4',

      // Spacing
      'mr-2',

      // Misc
      'cursor-default',
      'select-none',
    ],
  },
  headerCheckbox: {
    ...presetCheckbox,
    root: {
      class: [
        '!mx-auto',
        ...presetCheckbox.root.class,
        '[&:not(:has(svg))_[data-pc-section=box]]:!bg-primary-400',
        '[&:not(:has(svg))_[data-pc-section=box]]:!border-white',
      ],
    },
  },
  itemCheckbox: presetCheckbox,
  closeButton: {
    class: [
      'hidden',
      // 'relative',

      // // Flexbox and Alignment
      // 'flex items-center justify-center',

      // // Size and Spacing
      // 'mr-2',
      // 'last:mr-0',
      // 'w-6 h-6',

      // // Shape
      // 'border-0',
      // 'rounded-full',

      // // Colors
      // 'text-surface-500',
      // 'bg-transparent',

      // // Transitions
      // 'transition duration-200 ease-in-out',

      // // States
      // 'hover:text-surface-700 dark:hover:text-surface-700',
      // 'hover:bg-surface-100 dark:hover:bg-surface-800/80',
      // 'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset',
      // 'focus:ring-primary-500 dark:focus:ring-primary-400',

      // // Misc
      // 'overflow-hidden',
    ],
  },
  closeButtonIcon: {
    class: [
      // Display
      'inline-block',

      // Size
      'w-3',
      'h-3',
    ],
  },
  wrapper: {
    class: [
      // Sizing
      'max-h-[15rem]',

      // Shape
      'border-[0.5px]',

      // Color
      'bg-white',
      'border-grayscale-900',

      // Misc
      'overflow-auto',
      'rounded-br-lg',
      'rounded-bl-lg',
    ],
  },
  list: {
    class: 'list-none m-0',
  },
  item: ({ context }) => ({
    class: [
      // Font
      'text-xs font-normal',
      // { 'font-normal': !context.selected, 'font-bold': context.selected },

      // Flexbox
      'flex items-center gap-2',

      // Position
      'relative',

      // Shape
      'border-0',
      'rounded-none',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      { 'bg-primary-50': context.selected },
      {
        'text-surface-700 dark:text-general-100':
          !context.focused && !context.selected && !context.disabled,
      },
      {
        'text-surface-600 dark:text-general-300':
          !context.focused && !context.selected && context.disabled,
      },
      {
        'bg-surface-200 dark:bg-general-800 text-surface-700 dark:text-general-100':
          context.focused && !context.selected,
      },
      {
        'bg-primary-bg-weak dark:bg-general-800 text-primary dark:text-general-100':
          context.focused && context.selected,
      },
      {
        'text-surface-700 dark:text-general-100':
          !context.focused && context.selected,
      },

      //States
      'hover:bg-primary-bg-weak dark:hover:bg-general-700 hover:text-primary dark:hover:text-general-100',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

      // Misc
      { 'pointer-events-none cursor-default': context.disabled },
      { 'cursor-pointer': !context.disabled },
      'overflow-hidden',
      'whitespace-nowrap',
    ],
  }),
  option: {
    class: 'overflow-hidden text-ellipsis w-max',
  },
  itemgroup: {
    class: [
      //Font
      'font-bold',
      'sm:text-sm',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      'text-surface-800 dark:text-surface-800',
      'bg-surface-0 dark:bg-surface-0',

      // Misc
      'cursor-auto',
    ],
  },
  filtercontainer: {
    class: [
      'flex flex-row-reverse items-center relative w-full gap-2',
      // 'py-1',

      // Font
      'text-[0.7rem]',
      'leading-4',
      // 'sm:text-sm',

      // Sizing
      'w-full',

      //Color
      'text-grayscale-900 dark:text-grayscale-900',
      'bg-primary-400 dark:bg-primary-400',
      // 'ring-1 ring-inset ring-body dark:ring-white',

      // Shape
      'border-b border-primary-100',
      // 'rounded-[6px]',
    ],
  },
  filterinput: {
    class: [
      'w-full',

      'bg-primary-400 dark:bg-primary-400',
      'text-white dark:text-white',
      'placeholder:text-primary-100 dark:placeholder:text-primary-100',

      // Misc
      'appearance-none',

      // State
      'focus-visible:outline-none',
    ],
  },
  filtericon: {
    class: ['absolute', 'top-1/2 right-3', '-mt-2'],
  },
  clearicon: {
    class: [
      // Color
      'text-surface-500',

      // Position
      'absolute',
      'top-1/2',
      'right-12',

      // Spacing
      '-mt-2',
    ],
  },
  emptymessage: {
    class: [
      // Font
      'leading-none',
      'text-xs',

      // Spacing
      'py-2 px-4',

      // Color
      'text-grayscale-800 dark:text-general-100',
      'bg-transparent',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
};
