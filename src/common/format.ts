// src/common/format.ts

const priceFormatters = new Map<number, Intl.NumberFormat>();
const qtyFormatters = new Map<number, Intl.NumberFormat>();

function getPriceFormatter(dec: number): Intl.NumberFormat {
  let f = priceFormatters.get(dec);
  if (!f) {
    f = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: true,
    });
    priceFormatters.set(dec, f);
  }
  return f;
}

function getQtyFormatter(dec: number): Intl.NumberFormat {
  let f = qtyFormatters.get(dec);
  if (!f) {
    f = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: true,
    });
    qtyFormatters.set(dec, f);
  }
  return f;
}

export function formatPrice(raw: any, priceDec: number): string {
  if (raw === null || raw === undefined || raw === '') return '';
  const n = Number(String(raw).replace(/,/g, ''));
  if (isNaN(n)) return String(raw);
  return getPriceFormatter(priceDec).format(n / Math.pow(10, priceDec));
}

export function formatQty(raw: any, qtyDec: number): string {
  if (raw === null || raw === undefined || raw === '') return '';
  const n = Number(String(raw).replace(/,/g, ''));
  if (isNaN(n)) return String(raw);
  return getQtyFormatter(qtyDec).format(n / Math.pow(10, qtyDec));
}