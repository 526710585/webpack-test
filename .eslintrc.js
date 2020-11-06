module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true,
    jquery: true,
    node: true
  },
  rules: {
    "indent": ["error", 2],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-console": "error",
    "arrow-parens": 0
  },
  parser: "babel-eslint",
};