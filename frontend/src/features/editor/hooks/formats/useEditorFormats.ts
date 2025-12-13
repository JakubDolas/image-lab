import { useFormatsBase } from "./useFormatsBase";
import { BLOCKED_FORMATS } from "./blockedFormats";
import { getEditorSupportedFormats } from "@/features/editor/api/formats";

export function useEditorFormats() {
  return useFormatsBase(
    getEditorSupportedFormats,
    BLOCKED_FORMATS
  );
}
