/**
 * Validation engine.
 * Iterates rule arrays — no business logic lives here.
 */
import { FieldRule, FieldValidationContext, ValidationResult, ComplianceWarning } from './types';
import { fieldRules } from './fieldRules';
import { complianceRules } from './complianceRules';

/** Check if a rule matches the given field */
function ruleMatches(rule: FieldRule, field: string): boolean {
  if (typeof rule.match === 'string') return rule.match === field;
  if (Array.isArray(rule.match)) return rule.match.includes(field);
  return rule.match(field);
}

/**
 * Run field-level validation. First failing rule wins.
 */
export function runFieldValidation(
  field: string,
  value: string,
  filledFields: Record<string, string>,
  lang: 'en' | 'zh' = 'en',
): ValidationResult {
  const ctx: FieldValidationContext = { field, value, lang, filledFields };

  for (const rule of fieldRules) {
    if (!ruleMatches(rule, field)) continue;
    const result = rule.validate(ctx);
    if (result) return result;
  }

  return { status: 'pass', message: '' };
}

/**
 * Run compliance validation. Collects all warnings.
 */
export function runComplianceValidation(prefillData: any): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  for (const rule of complianceRules) {
    rule.check(prefillData, warnings);
  }
  return warnings;
}
