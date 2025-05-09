import { readFileSync } from 'fs';
import { resolve } from 'path';

interface PackageInfo {
  name: string;
  description: string;
  version: string;
  author: string;
}

export function readPackageInfo(): PackageInfo {
  const packageJsonPath = resolve('package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  return {
    name: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
    author: packageJson.author,
  };
}
