/*
PDFImage - embeds images in PDF documents
By Devon Govett
*/

import fs from 'fs';
import JPEG from './image/jpeg';
import PNG from './image/png';

class PDFImage {
  static open(src, label) {
    console.log('src type:', typeof src);
    console.log('src instanceof Uint8Array:', src instanceof Uint8Array);
    console.log('src instanceof Buffer:', Buffer.isBuffer(src));
    console.log('src:', src);
    let data;
    if (Buffer.isBuffer(src)) {
      data = src;
    } else if (src instanceof ArrayBuffer) {
      data = Buffer.from(new Uint8Array(src));
    } else if (src instanceof Uint8Array) {
      Buffer.from(src);
    } else {
      let match;
      if ((match = /^data:.+?;base64,(.*)$/.exec(src))) {
        data = Buffer.from(match[1], 'base64');
      } else {
        data = fs.readFileSync(src);
        if (!data) {
          return;
        }
      }
    }

    if (data[0] === 0xff && data[1] === 0xd8) {
      return new JPEG(data, label);
    } else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
      return new PNG(data, label);
    } else {
      throw new Error('Unknown image format.');
    }
  }
}

export default PDFImage;
