export interface WheelItem<TValue = unknown> {
  id: string;
  label: string;
  wheelLabel?: string;
  weight: number;
  value?: TValue;
}
