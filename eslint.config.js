export default {
  extends: "next/core-web-vitals",
  rules: {
    "no-unused-vars": [
      error,
      { ars: "all", args: "after-used", ignoreRestSiblings: false }
    ]
  }
}