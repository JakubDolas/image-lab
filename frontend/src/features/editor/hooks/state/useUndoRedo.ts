export function useUndoRedo(
  ptr: number,
  setPtr: (fn: (p: number) => number) => void,
  stepsLength: number
) {
  const onUndo = () => {
    if (ptr > 0) setPtr((p) => p - 1);
  };

  const onRedo = () => {
    if (ptr < stepsLength - 1) setPtr((p) => p + 1);
  };

  return { onUndo, onRedo };
}
