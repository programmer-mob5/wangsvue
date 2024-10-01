export default {
  root: ({ props }) => ({
    class: [
      // Alignments
      'inline-flex relative align-middle',
      'shrink-0',

      // Shape
      'rounded-[60px]',

      // Size
      'h-4 w-8',

      // Misc
      'cursor-pointer',

      // States
      {
        'select-none pointer-events-none cursor-default': props.disabled,
      },
    ],
  }),
  slider: ({ props }) => ({
    class: [
      // Position
      'absolute top-0 left-0 right-0 bottom-0',

      // Shape
      'rounded-[60px]',

      // Before:
      'before:absolute before:top-1/2',
      'before:-mt-[6px] before:ml-0.5',
      'before:h-3 before:w-3',
      'before:rounded-full',
      'before:duration-200 before:transition before:ease-in-out',
      'before:shadow',
      {
        'before:bg-white before:dark:bg-white':
          props.modelValue == props.trueValue,
        'before:bg-primary-200 before:dark:bg-primary-200':
          props.modelValue !== props.trueValue && !props.disabled,
        'before:bg-general-50 before:dark:bg-general-50':
          props.modelValue !== props.trueValue && props.disabled,
      },
      {
        'before:transform before:translate-x-3.5':
          props.modelValue == props.trueValue,
      },

      // Colors
      'border',
      {
        'border-primary-200':
          props.modelValue !== props.trueValue && !props.disabled,
        'border-transparent': props.modelValue == props.trueValue,
      },
      {
        'bg-white dark:bg-white':
          props.modelValue !== props.trueValue && !props.disabled,
        'bg-primary-500 dark:bg-primary-500':
          props.modelValue == props.trueValue && !props.disabled,
        'bg-primary-100 dark:bg-primary-100':
          props.modelValue == props.trueValue && props.disabled,
        'bg-general-100 dark:bg-general-100':
          props.modelValue !== props.trueValue && props.disabled,
      },

      // States
      // {
      //   'peer-hover:bg-surface-300 dark:peer-hover:bg-surface-600 ':
      //     !(props.modelValue == props.trueValue) && !props.disabled,
      // },
      // {
      //   'peer-hover:bg-primary-600 dark:peer-hover:bg-surface-300 ':
      //     props.modelValue == props.trueValue && !props.disabled,
      // },
      'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400',

      // Transition
      'transition-colors duration-200',

      // Misc
      'cursor-pointer',
    ],
  }),
  input: ({ props }) => ({
    class: [
      'peer',

      // Size
      'w-full ',
      'h-full',

      // Position
      'absolute',
      'top-0 left-0',
      'z-10',

      // Spacing
      'p-0',
      'm-0',

      // Shape
      'rounded',
      'border',

      // Shape
      'opacity-0',
      'rounded-md',
      'outline-none',
      'border-2 border-surface-300 dark:border-surface-700',

      // Misc
      'appearance-none',
      {
        'cursor-default': props.disabled,
        'cursor-pointer': !props.disabled,
      },
    ],
  }),
};
