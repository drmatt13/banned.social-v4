function blobToBase64(blob: Blob | undefined): Promise<string | undefined> {
  if (!blob) return Promise.resolve(undefined);
  return new Promise<string | undefined>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(",")[1]);
    };
    reader.onerror = () => {
      resolve(undefined);
    };
    reader.readAsDataURL(blob);
  });
}

export default blobToBase64;
