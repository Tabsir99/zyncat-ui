export interface LlmsLine {
  text: string;
  line: number;
}
export interface LlmsParsedSection {
  title: string;
  line: number;
  body: string[];
}
export interface LlmsParsedEntry {
  title: string;
  subpath: string;
  section: string;
  line: number;
  heading: string;
  body: LlmsLine[];
}
export interface LlmsDocument {
  preamble: string[];
  sections: LlmsParsedSection[];
  entries: LlmsParsedEntry[];
}

export declare const SECTION_RE: RegExp;
export declare const HEADING_RE: RegExp;
export declare function parseLlms(text: string): LlmsDocument;
export declare function entryLines(entry: LlmsParsedEntry): string[];
export declare const PROP_COUNT_RE: RegExp;
export declare function formatPropCount(count: number, subpath: string): string;
export declare function entryProse(entry: LlmsParsedEntry): LlmsLine[];
