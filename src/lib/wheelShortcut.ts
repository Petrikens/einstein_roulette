export function resolveWheelShortcutEnabled(
  isScreenActive: boolean,
  isEditorOpen: boolean,
  isResultOpen: boolean,
): boolean {
  return isScreenActive && !isEditorOpen && !isResultOpen;
}
