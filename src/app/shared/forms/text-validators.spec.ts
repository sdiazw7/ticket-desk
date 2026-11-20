import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { maxTextLength, requiredText } from './text-validators';

describe('text validators', () => {
  function messagesFor(value: string): string[] {
    const model = signal({ name: value });
    const nameForm = form(
      model,
      (field) => {
        requiredText(field.name, 'Name is required.');
        maxTextLength(field.name, 5, 'Name');
      },
      { injector: TestBed.inject(Injector) },
    );
    return nameForm
      .name()
      .errors()
      .map((error) => error.message ?? '');
  }

  it('accepts normal text', () => {
    expect(messagesFor('Maria')).toEqual([]);
  });

  it('rejects empty text', () => {
    expect(messagesFor('')).toEqual(['Name is required.']);
  });

  it('rejects text made only of spaces', () => {
    expect(messagesFor('   ')).toEqual(['Name is required.']);
  });

  it('rejects text over the maximum length with a readable message', () => {
    expect(messagesFor('Mariana')).toEqual(['Name must be 5 characters or fewer.']);
  });
});
