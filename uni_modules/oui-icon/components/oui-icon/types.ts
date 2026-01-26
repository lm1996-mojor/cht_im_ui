import type { ExtractPropTypes } from 'vue';

export const iconProps = {
  customClass: String,
  customStyle: String,
  classPrefix: {
    type: String,
    default: 'oui-icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 16,
  },
  color: {
    type: String,
    default: '#000000',
  },
};

export interface IconEmits {
  (e: 'click', event: unknown): void;
}

export type IconProps = ExtractPropTypes<typeof iconProps>;
