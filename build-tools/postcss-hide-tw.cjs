/*
 * Runs after Tailwind. Renames Tailwind's internal custom properties (--tw-*) to --z-*, so the
 * built CSS doesn't carry the "--tw-rotate / --tw-shadow ..." fingerprint stack detectors look for.
 * Behaviour is unchanged: every declaration, var() reference and @property rule is renamed together.
 * (Kept outside scripts/ and build/ so .dockerignore doesn't drop it.)
 */
const FROM = /--tw-/g;
const TO = "--z-";

module.exports = () => ({
  postcssPlugin: "hide-tw",
  OnceExit(root) {
    root.walkDecls((decl) => {
      if (decl.prop.startsWith("--tw-")) decl.prop = TO + decl.prop.slice(5);
      if (decl.value.includes("--tw-")) decl.value = decl.value.replace(FROM, TO);
    });
    root.walkAtRules((rule) => {
      if (rule.params.includes("--tw-")) rule.params = rule.params.replace(FROM, TO);
    });
    root.walkRules((rule) => {
      if (rule.selector.includes("--tw-")) rule.selector = rule.selector.replace(FROM, TO);
    });
  },
});
module.exports.postcss = true;
