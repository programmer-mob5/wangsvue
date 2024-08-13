import { DefineComponent, Slot } from 'vue';
import { DropdownOption, OptionValue } from 'lib/types/options.type';
import { CustomValidation } from 'types/validation.type';

/**
 * Dropdown component props
 */
export interface DropdownProps {
  /**
   * Don't use modelValue with useValidator at the same time.
   * It may lead unexpected behavior.
   */
  modelValue?: OptionValue;
  /**
   * If you deals with form validation on edit form action, you can set the initial value of the field.
   */
  initialValue?: OptionValue;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * List of options to display.
   */
  options?: DropdownOption[] | string[];
  /**
   * Specify the property name of option to be used as label.
   *
   * @default undefined - the label will be sets to the option itself.
   */
  optionLabel?: string;
  /**
   * Specify the property name of option to be used as value.
   *
   * @default undefined - the value will be sets to the option itself.
   */
  optionValue?: string;
  /**
   * A property to uniquely identify an option.
   */
  dataKey?: string | undefined;
  /**
   * Determines if the field uses a validator
   */
  useValidator?: boolean;
  /**
   * Determines if the field is mandatory
   */
  mandatory?: boolean;
  /**
   * Set custom validator message.
   * It is rarely use, this component has handled the validator message.
   */
  validatorMessage?: string;
  /**
   * Wether to format the message
   *
   * @default true
   */
  formatValidatorMessage?: boolean;
  /**
   * Set custom invalid state.
   */
  invalid?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'dropdown'
   */
  fieldName?: string;
  /**
   * Default text to display when no option is selected.
   *
   * @default `Select ${label}`
   */
  placeholder?: string;
  /**
   * Whether the dropdown is in loading state.
   * @defaultValue false
   */
  loading?: boolean;
  /**
   * Show icon 'info' on the right side of label.
   * Show information to user about the field on icon hover.
   */
  fieldInfo?: string;
  /**
   * Set disabled state for input dropdown.
   */
  disabled?: boolean;
  /**
   * Wether show the Dropdown option search or not.
   *
   * @default false,
   */
  filter?: boolean;
  /**
   * The filter input Placeholder
   *
   * @default 'Search'
   */
  filterPlaceholder?: string;
  customValidation?: CustomValidation;
}

export interface DropdownSlots {
  'option': Slot<{ option: DropdownOption }>;
  'addon-left': Slot;
  'addon-right': Slot;
}

/**
 * Dropdown component emits
 */
export type DropdownEmits = {
  /**
   * Emits when an option selected.
   */
  'update:modelValue': [value: OptionValue | undefined];
  /**
   * Emits when overlay shown.
   */
  'show': [];
};

/**
 * **TSVue - Dropwdown**
 *
 * _Dropdown also known as Select, is used to choose an item from a collection of options._
 *
 * --- ---
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group Component
 */
declare const Dropdown: DefineComponent<
  DropdownProps,
  DropdownSlots,
  DropdownEmits
>;

export default Dropdown;