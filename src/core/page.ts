export interface Page {
  name: string;
  path: string;
  link: string;
  types: string[];
  /* excerpt: string; */
  numWords: number;
  params: any;
  /* tokens: any; */
  htmlContent: string;
}
