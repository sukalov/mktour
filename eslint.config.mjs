import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "prettier"),

    rules: {
        "no-unused-vars": ["warn", { // #TODO: ASAP change it back to error 
            vars: "all",
            args: "all",
            ignoreRestSiblings: true,
            argsIgnorePattern: "_",
        }],
    },
}]);