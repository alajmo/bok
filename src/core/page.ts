export interface Page {
  name: string;
  path: string;
  link: string;
  prevPage?: string | null;
  nextPage?: string | null;
  params: any;
  htmlContent: string;
  tokens: any[];
  build: boolean;
  rightToc?: string;
  toc?: string;
  lastmod?: Date;
}
