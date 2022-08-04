import { addSuffix } from "./commonjs/util";
import  { addPrefix } from "./esm/util";

const source = "javaSwing";

const sourceAddSuffix = addSuffix(source);

const sourceAddPrefix = addPrefix(source);

console.log("sourceAddSuffix: ", sourceAddSuffix);

console.log("sourceAddPrefix: ", sourceAddPrefix);
