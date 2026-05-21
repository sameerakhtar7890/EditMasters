import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button, Container, Form, Image } from "react-bootstrap";

const Imgtopdf = () => {
  const [file, setFile] = useState(null);

  // const fileToArrBuffer = (file) =>
  //   new Promise((res, rej) => {
  //     const fileReader = new FileReader();
  //     fileReader.onload = () => res(fileReader.result);
  //     fileReader.onerror = () => rej(fileReader.error);
  //     fileReader.readAsArrayBuffer(file);
  //   });

  // const downloadFile = async (blob) => {
  //   const URL = window.URL.createObjectURL(blob);
  //   const el = document.createElement("a");
  //   el.download = "file.pdf";
  //   el.href = URL;
  //   el.click();
  //   window.URL.revokeObjectURL(URL);
  // };

  // const embedImageInPdfAndDownload = async () => {
  //   const pdfDoc = await PDFDocument.create();
  //   const buffer = await fileToArrBuffer(file);
  //   let image;
  //   if (/jpe?g/i.test(file.type)) image = await pdfDoc.embedJpg(buffer);
  //   else if (/png/i.test(file.type)) image = await pdfDoc.embedPng(buffer);
  //   else throw Error("please choose a JPEG or PNG file to proceed");

  //   const page = pdfDoc.addPage();
  //   page.drawImage(image, {
  //     width: image.scale(0.5).width,
  //     height: image.scale(0.5).height,
  //     x: 100,
  //     y: 100,
  //   });

  //   let b64Chunk = await pdfDoc.saveAsBase64();
  //   b64Chunk = "data:application/pdf;base64," + b64Chunk;
  //   const blob = await (await fetch(b64Chunk)).blob();
  //   downloadFile(blob);
  // };

  const fileToArrBuffer = (file) =>
    new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onload = () => res(fileReader.result);
      fileReader.onerror = () => rej(fileReader.error);
      fileReader.readAsArrayBuffer(file);
    });

  const downloadFile = async (blob) => {
    const URL = window.URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.download = "file.pdf";
    el.href = URL;
    el.click();
    window.URL.revokeObjectURL(URL);
  };

  const embedImageInPdfAndDownload = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const buffer = await fileToArrBuffer(file);
      let image;
      if (/jpe?g/i.test(file.type)) {
        image = await pdfDoc.embedJpg(buffer);
      } else if (/png/i.test(file.type)) {
        image = await pdfDoc.embedPng(buffer);
      } else {
        throw new Error("Please choose a JPEG or PNG file to proceed");
      }

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const imageWidth = image.width;
      const imageHeight = image.height;

      const scaleFactor = Math.min(width / imageWidth, height / imageHeight);

      page.drawImage(image, {
        width: imageWidth * scaleFactor,
        height: imageHeight * scaleFactor,
        x: (width - imageWidth * scaleFactor) / 2,
        y: (height - imageHeight * scaleFactor) / 2,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadFile(blob);
    } catch (error) {
      console.error("Error embedding image in PDF:", error);
    }
  };

  return (
    <Container className="mt-10" style={{ backgroundColor: "white" }}>
      <h1 className="text-center" style={{ fontWeight: "bolder" }}>
        <span style={{ color: "#176ede" }}>IMAGE</span> TO PDF
      </h1>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
          />
        </Form.Group>
        {file && (
          <div>
            <Image
              src={URL.createObjectURL(file)}
              alt="some_image"
              width={300}
            />
            <p>{file.name}</p>
          </div>
        )}
        {file && (
          <Button variant="success" onClick={embedImageInPdfAndDownload}>
            Embed Image in PDF and Download
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default Imgtopdf;
