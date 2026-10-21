import { expect, test } from "bun:test";
import rawPkg from "../package.json";

const pkg = rawPkg as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

// AGENTS.md: versi dikunci exact di package.json (tanpa ^ atau ~).
test("semua dependensi dikunci exact", () => {
  const semua = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const [nama, versi] of Object.entries(semua)) {
    expect(versi, nama).toMatch(/^\d+\.\d+\.\d+$/);
  }
});

test("tidak ada Next.js atau React", () => {
  const semua = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  expect(semua.filter((n) => n === "next" || n === "react" || n === "react-dom")).toEqual([]);
});
