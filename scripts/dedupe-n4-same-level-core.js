const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  284: "86",
  183: "120",
  292: "137",
  296: "252",
  299: "279",
};

for (const [from, to] of Object.entries(deleteRedirects)) redirects[from] = to;
for (const [from, to] of Object.entries(redirects)) {
  if (deleteRedirects[to]) redirects[from] = deleteRedirects[to];
}

const deleted = new Set(Object.keys(deleteRedirects));
const nextGrammar = grammar.filter((item) => !deleted.has(item.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
