import { useConversionFiles } from "./conversion/useConversionFiles";
import { useConversionOptions } from "./conversion/useConversionOptions";
import { useZipConversion } from "./conversion/useZipConversion";

export function useConversionState() {
  const filesState = useConversionFiles();

  const options = useConversionOptions(filesState.files.length);

  const zip = useZipConversion(
    filesState.files,
    options.formats,
    options.quality,
    options.sizes,
    filesState.setError
  );

  return {
    ...filesState,
    ...options,
    ...zip,
  };
}
