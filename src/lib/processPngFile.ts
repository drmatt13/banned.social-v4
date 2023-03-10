async function processPngFile(file: File): Promise<File> {
  // Check if the file is a PNG image
  if (file.type === "image/png") {
    // Read the contents of the file as a data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Create a new image element with the data URL as its source
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Create a canvas element and draw the image on it
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(img, 0, 0);

    // Set the background color to white
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Convert the canvas back to a PNG image
    const newDataUrl = canvas.toDataURL("image/png");
    const newBlob = await fetch(newDataUrl).then((res) => res.blob());

    // Return the modified image as a new File object
    return new File([newBlob], file.name, { type: "image/png" });
  }

  // If the file is not a PNG image, return null
  return file;
}

export default processPngFile;
