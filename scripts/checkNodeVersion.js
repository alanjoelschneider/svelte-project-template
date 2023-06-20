const result = process.versions;

if (result && result.node) {
  console.log('Node version', result.node);
}
