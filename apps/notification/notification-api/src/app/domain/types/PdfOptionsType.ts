// the options must match the options on the page https://wkhtmltopdf.org/usage/wkhtmltopdf.txt
// options must be in Camelcase
export type PdfOptionsType = {
  marginBottom?: string;
  enableSmartShrinking?: boolean;
  marginLeft?: number;
  marginRight?: number;
};
