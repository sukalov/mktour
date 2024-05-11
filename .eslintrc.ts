export default {
  plugins: ['mobx'],
  extends: ['next/core-web-vitals', 'plugin:mobx/recommended'],
  rules: {
    'no-unused-vars': [
      "error",
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'mobx-missed-observer': 'off',
  },
};
