import QRCode from 'qrcode'

export const generateQRCode = async (data) => {
  try {
    // Convert the data to a string if it's an object
    const stringData = typeof data === 'object' ? JSON.stringify(data) : data
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(stringData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
} 