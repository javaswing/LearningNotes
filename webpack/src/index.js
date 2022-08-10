import { addSuffix } from "./commonjs/util";
import { addPrefix } from "./esm/util";

const source = "javaSwing";

console.log("sourceAddSuffix: ", addSuffix(source));

console.log("sourceAddPrefix: ", addPrefix(source));
