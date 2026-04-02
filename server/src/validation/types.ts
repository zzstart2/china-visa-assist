/**
 * Validation type definitions.
 */

export interface ValidationResult {
  status: 'pass' | 'fail';
  message: string;
}

export interface ComplianceWarning {
  field: string;
  level: 'error' | 'warning';
  messageEn: string;
  messageZh: string;
}

export interface FieldValidationContext {
  field: string;
  value: string;
  lang: 'en' | 'zh';
  filledFields: Record<string, string>;
}

export interface FieldRule {
  /** Field path(s) this rule applies to, or a predicate function */
  match: string | string[] | ((field: string) => boolean);
  /** Return a failing ValidationResult, or null to pass */
  validate: (ctx: FieldValidationContext) => ValidationResult | null;
}

export interface ComplianceRule {
  name: string;
  check: (prefillData: any, warnings: ComplianceWarning[]) => void;
}
