import fs from "fs";
import path from "path";

// Files to copy from /public to /dist
const filesToCopy = [
  { from: "public/manifest.json", to: "dist" },
  { from: "popup.html", to: "dist" },
  { from: "public/icon-16.png", to: "dist" },
  { from: "public/icon-48.png", to: "dist" },
  { from: "public/icon-128.png", to: "dist" },
];

// Loop through each file and copy it
filesToCopy.forEach(({ from, to }) => {
  const destPath = path.join(process.cwd(), to);

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  fs.copyFileSync(
    path.join(process.cwd(), from),
    path.join(destPath, path.basename(from))
  );
});
