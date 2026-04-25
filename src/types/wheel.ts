export interface WheelItem<TValue = unknown> {
  id: string;
  label: string;
  weight: number;
  value?: TValue;
}
