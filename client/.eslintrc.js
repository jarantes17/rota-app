module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb", "prettier", "prettier/react"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".js"] }],
    "import/prefer-default-export": "off",
    "no-unused-vars": "off",
    "import/no-unresolved": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/anchor-is-valid": 0,
    "react/destructuring-assignment": "off",
    "no-param-reassign": ["error", { props: false }],
    "eslint no-nested-ternary": "off",
    "react/forbid-prop-types": "off",
    "no-shadow": "off",
    "camelcase": "off"
  }
}
