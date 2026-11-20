import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  maxLength,
  required,
  validate,
} from '@angular/forms/signals';

type TextPath<TPathKind extends PathKind> = SchemaPath<
  string,
  SchemaPathRules.Supported,
  TPathKind
>;

/**
 * A required text field: rejects empty input and input made only of spaces.
 * Uses the built-in `required` rule too, so the field is also marked as required
 * for assistive technology.
 */
export function requiredText<TPathKind extends PathKind = PathKind.Root>(
  path: TextPath<TPathKind>,
  message: string,
): void {
  required(path, { message });
  validate(path, ({ value }) =>
    value().length > 0 && value().trim() === '' ? { kind: 'blank', message } : undefined,
  );
}

/** A maximum length with a consistently worded message, such as "Title must be 120 characters or fewer." */
export function maxTextLength<TPathKind extends PathKind = PathKind.Root>(
  path: TextPath<TPathKind>,
  max: number,
  label: string,
): void {
  maxLength(path, max, { message: `${label} must be ${max} characters or fewer.` });
}
