export async function convertToEditorPng(file: File): Promise<Blob> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/convert/to-editor", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let msg = "Konwersja do PNG nie powiodła się.";

    try {
      const data = await res.json();
      if (data?.detail) msg = data.detail;
    } catch {}

    throw new Error(msg);
  }

  const blob = await res.blob();
  return new Blob([blob], { type: "image/png" });
}
