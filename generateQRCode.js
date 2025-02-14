const QRCode = require('qrcode');  // Import the 'qrcode' package

// Generate the QR code with the local IP
QRCode.toFile('qrcode.png', 'http://10.0.0.6:3000', function (err) {
  if (err) throw err;
  console.log('QR code saved as qrcode.png');
});
