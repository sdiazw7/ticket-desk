// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

/**
 * Architecture rules: who may import whom.
 * Each folder type gets a list of forbidden import patterns. Breaking a rule fails `npm run lint`.
 */
const restrict = (...groups) => ({
  'no-restricted-imports': ['error', { patterns: groups }],
});

const noFeatures = {
  group: ['**/features/**', '@features/*'],
  message: 'core/ and shared/ must not depend on features. Move the shared code down instead.',
};

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },

  // shared/: reusable and stateless; knows nothing about the app or any feature.
  {
    files: ['src/app/shared/**/*.ts'],
    rules: restrict(noFeatures, {
      group: ['@core/*', '../core/*', '../../core/*'],
      message: 'shared/ must not depend on core/. Shared code should work in any app.',
    }),
  },

  // core/: app-wide plumbing; must not depend on features (app.routes.ts lives outside core/).
  {
    files: ['src/app/core/**/*.ts'],
    rules: restrict(noFeatures),
  },

  // domain/: pure business types and rules, independent of Angular, RxJS and other layers.
  {
    files: ['src/app/features/*/domain/**/*.ts'],
    rules: restrict(
      {
        group: ['@angular/*', 'rxjs', 'rxjs/*'],
        message: 'domain/ must stay framework-free: plain TypeScript only.',
      },
      {
        group: ['../data-access/*', '../ui/*', '../pages/*', '@core/*', '@shared/*'],
        message: 'domain/ must not depend on other layers.',
      },
    ),
  },

  // data-access/: HTTP and data mapping; may use domain/, never UI.
  {
    files: ['src/app/features/*/data-access/**/*.ts'],
    rules: restrict({
      group: ['../ui/*', '../pages/*', '@shared/*'],
      message: 'data-access/ must not depend on UI code.',
    }),
  },

  // ui/: presentational components; data comes in through inputs, never from services.
  {
    files: ['src/app/features/*/ui/**/*.ts'],
    rules: restrict(
      {
        group: ['../data-access/*', '../pages/*'],
        message: 'ui/ components get data through inputs. Load data in a page instead.',
      },
      {
        group: ['@angular/common/http', '@angular/router'],
        message:
          'ui/ components must not call HTTP or navigate. Emit an output and let the page decide.',
      },
    ),
  },

  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
