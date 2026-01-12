import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Ignorar salida de build y deps
    {
        ignores: ["dist/**", "node_modules/**"]
    },

    // Reglas base de JS recomendadas
    js.configs.recommended,

    // Config para TypeScript
    {
        files: ["src/**/*.ts"],
        languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        }
        },
        plugins: {
        "@typescript-eslint": tseslint
        },
        rules: {
        // mínimo útil (sin volverte loco)
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

        "no-undef": "off" // en TS suele dar falsos positivos con tipos
        }
    }
];
