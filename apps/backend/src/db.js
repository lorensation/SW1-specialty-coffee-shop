import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const root = resolve(process.cwd(), "../../"); // llega a sw1-specialty-coffee/
const file = (name)=> resolve(root, "data", name);

export function readJson(name){
  return JSON.parse(readFileSync(file(name), "utf8"));
}
export function writeJson(name, data){
  writeFileSync(file(name), JSON.stringify(data,null,2));
}
