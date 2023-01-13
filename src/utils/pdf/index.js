import PdfPrinter from "pdfmake"; //the library itself ✅
import striptags from "striptags"; //delete script tags (cuz we are sending html with scripts) (not core library) ✅
import axios from "axios";
// ------------------------- here are just the fonts choices --------------------------  ✅
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts); // ---------- printer = pdfprinter with these specific fonts ✅

export const generateBlogPDF = async (blog) => {
  // ------------------------- our main and the only function here --------------------------   ✅
  //---------------- for images 🌟
  let imagePart = {};
  if (blog.cover) {
    const response = await axios.get(blog.cover, {
      responseType: "arraybuffer",
    });
    const blogCoverURLParts = blog.cover.split("/");
    const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }
  //-------------- for document 🌟
  const docDefinition = {
    content: [
      imagePart,
      { text: blog.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
      { text: striptags(blog.content), lineHeight: 2 },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition); //printer.createPdfKitDocument returns a stream
  return pdfDoc; //actual stream
};

/*           ----------------------------------------------- WHAT ARE STREAMS? --------------------------------------------------

Streams are a way to handle reading/writing files, network communications, or any kind of end-to-end information exchange in an efficient way.

What makes streams unique, is that instead of a program reading a file into memory all at once like in the traditional way, streams read chunks of data piece by piece, processing its content without keeping it all in memory. */
