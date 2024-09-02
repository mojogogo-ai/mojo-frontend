// import js from "@eslint/js";
import pluginVue from 'eslint-plugin-vue'
export default [
    // js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
      ignores: ["node_modules",
      "packages/components/lib/",
      "packages/*/src/assets/",
      "packages/*/node_modules/",
      "packages/*/report.html", 
      "packages/portal-pc/dist/",
      "packages/portal-h5/dist/",
     ]
    },
    {
       files: ["**/*.js", "**/*.vue"],
       rules: {
        "no-useless-escape": 0,
        "no-unused-vars": 1,
        "prefer-promise-reject-errors": 0,
        "camelcase": 0,
        "prefer-regex-literals": 0,
        "vue/multi-word-component-names": 0,
        "vue/no-v-html": 0,
        "vue/max-attributes-per-line": [0, {
          "singleline": {
            "max": 1
          },      
          "multiline": {
            "max": 1
          }
        }],
        "vue/valid-v-for": 0,
        "vue/require-v-for-key": 0,
        "vue/singleline-html-element-content-newline":0
      }
   }
];