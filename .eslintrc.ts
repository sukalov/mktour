export default {
  plugins: ['mobx'],
  extends: ['next/core-web-vitals'],
  rules: {
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
  },
};