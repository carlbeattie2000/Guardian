const { join } = require("path");
const { mkdirSync, statSync } = require("fs");

function usePublicDir() {
  const path = join(process.cwd(), "public");

  const publicDirStat = statSync(path);

  if (!publicDirStat.isDirectory()) {
    mkdirSync(path);
  }

  return path;
}

module.exports = usePublicDir;
