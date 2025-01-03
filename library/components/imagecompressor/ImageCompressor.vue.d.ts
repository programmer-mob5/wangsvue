import { CustomValidation } from '../form/Form.vue.d';
import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

export type Image = {
  src: string | null;
  type: string | null;
};

export type ImageCompressorPayload = {
  canvas: HTMLCanvasElement | undefined;
  compressed: {
    blob: string | Blob;
    base64: string;
    fileName: string;
    file: File;
    size: string;
    type: 'image/webp';
  };
  message?: string;
};

export interface ImageCompressorProps {
  /**
   * Specify the user initial name for the Image Placeholder
   *
   * max-length: 3
   */
  initialName?: string;
  /**
   * Specify the input type, wether single ro multiple image input.
   *
   * @default false - single input.
   */
  multiple?: boolean;
  /**
   * The default image index 0 / 1
   */
  defaultImage?: number;
  /**
   * Disable the image input.
   *
   * @todo add disabled state.
   */
  disabled?: boolean;
  /**
   * Display a compressed Blob image or a string objectURL of a Blob when mounted.
   */
  compressedBlob?: string | Blob | (string | Blob)[];
  /**
   * Display an image with the URL instead.
   */
  imagePreviewUrl?: string | string[];
  /**
   * Specify the size image input and preview size.
   *
   * - small: 30px
   * - medium: 80px
   * - big: 125*125 px
   *
   * @todo Add small size. Currently only support big size.
   * @default 'big'
   */
  imagePreviewSize?: 'small' | 'medium' | 'big';
  /**
   * Specify the rounded level.
   *
   * If true, the image will be full rounded.
   *
   * @default 'false'
   */
  rounded?: boolean;
  /**
   * Specify whether the image able to be deleted or not (in case image only able to added and edited)
   *
   * @default true
   */
  useDeleteButton?: boolean;
  /**
   * Specify whether the image input will be used as field within Form validation.
   *
   */
  useValidator?: boolean;
  /**
   * Specify if the field is required or not.
   */
  mandatory?: boolean;
  /**
   * Set the invalid state and display the custom validator message.
   */
  invalid?: boolean;
  /**
   * Set custom validation message.
   */
  validatorMessage?: string | CustomValidation;
  /**
   * The field label.
   *
   * @default undefined - if props.useValidator not presents.
   * @default 'Photo' - if props.useValidator presents.
   */
  label?: string;
  /**
   * Specify the field name to make the input available on form validation payload.
   *
   * @default 'imageInput'
   */
  fieldName?: string;
  /**
   * Display field information as tooltip.
   */
  fieldInfo?: string;
  /**
   * Show the image requirement info section.
   *
   * @default true
   */
  showInfo?: boolean;
  /**
   * Show dialog confirmation before delete the image.
   */
  confirmOnDelete?: boolean;
  /**
   * On clicking delete button, emit the delete function instead of deleting the image.
   * Useful when showing custom dialog confirmation.
   */
  emitDeleteFn?: boolean;
  /**
   * Show the validation message section.
   *
   * @default true
   */
  showValidatorMessage?: boolean;
}

export interface ImageCompressorSlots {
  [key: string]: unknown;
}

export type ImageCompressorEmits = {
  /**
   * On apply the image cropper.
   */
  'apply': [value: ImageCompressorPayload];
  /**
   * On apply image from props.
   */
  'applyProp': [];
  'update:defaultImage': [index?: number];
  /**
   * On delete button clicked.
   *
   * When confirmOnDelete / emitDelete is true, this emit will be emitted with a delete function.
   * You need to call the function inside your own delete funcition to clear the image.
   *
   * @param deleteFn - the function delete
   * @param index - the index of image to be deleted
   */
  'delete': [deleteFn?: (index?: number) => void, index?: number];
};

/**
 * **WangsVue - ImageCompressor**
 *
 * _Handle image input and compression._
 *
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 *
 */
declare class ImageCompressor extends ClassComponent<
  ImageCompressorProps,
  ImageCompressorSlots,
  ImageCompressorEmits
> {
  /**
   * Exposed function to assign image from props.
   *
   * @param isDelete
   */
  assignPreviewImagesFromProp(isDelete?: boolean): Promise<void>;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ImageCompressor: GlobalComponentConstructor<ImageCompressor>;
  }
}

export default ImageCompressor;
