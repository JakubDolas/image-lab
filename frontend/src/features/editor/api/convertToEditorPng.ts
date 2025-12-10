export async function convertToEditorPng(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/convert/to-editor", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Konwersja do PNG nie powiodła się: " + txt);
  }

  const blob = await res.blob();
  
  return new Blob([blob], { type: "image/png" });
}
