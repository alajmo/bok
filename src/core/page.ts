export interface Page {
  name: string;
  path: string;
  link: string;
  prevPage?: string;
  nextPage?: string;
  params: any;
  htmlContent: string;
  tokens: any[];
  build: boolean;
  rightToc?: string;
}
