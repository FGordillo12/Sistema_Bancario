import JSEncrypt from "jsencrypt";

// LLAVE PUBLICA
export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjnvBSg4PqqzgYVNB1X4h
cp712WNhX7G4M/Rjl9tGB+/ppI694bPpjHsBeH8uBMmOyE0pxhazc/WkLPLHLiR8
AZZDzDhCSRB3/xGYUx5aeGTKfBRm0AyuzIP3/R2wcuJ0ZXuhZP5p5fN9E3jTdQ+L
QLTP3V56nbn0Q2a8UHhXhJ7lkJqPEpVDaKrINJcJIFbHW9qO7w2Tmi6IoXSZ+vSw
OaSSVypmRsxlOCOMvPHbFzGOJanDl1pY1WloCH0Ft4lrH8UP4uCJAarcvyEWeDLR
tVTd52CS1dvwmPR8ANgggdeOtf6X/XgR5Y+rG3dInHudXXGD2DjSn0Sz/kgQuvQC
BwIDAQAB
-----END PUBLIC KEY-----`;

export const cifrarMonto = (monto) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  return encrypt.encrypt(monto.toString());
};
