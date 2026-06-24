import { ENV } from '../config/env';

export interface GSTCalculation {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  gstRate: number;
}

export function calculateGST(pricePerNight: number, nights: number, isInterState = false): GSTCalculation {
  const subtotal = pricePerNight * nights;
  
  let gstRate: number = ENV.GST_RATE_BELOW_2500;
  if (pricePerNight >= 2500 && pricePerNight < 7500) {
    gstRate = ENV.GST_RATE_2500_TO_7500;
  } else if (pricePerNight >= 7500) {
    gstRate = ENV.GST_RATE_ABOVE_7500;
  }

  const gstAmount = (subtotal * gstRate) / 100;
  
  let cgst = 0, sgst = 0, igst = 0;
  if (isInterState) {
    igst = gstAmount;
  } else {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }

  return {
    subtotal,
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    igst: parseFloat(igst.toFixed(2)),
    total: parseFloat((subtotal + gstAmount).toFixed(2)),
    gstRate,
  };
}