import { LoaderContext } from "webpack";
import { getOptions } from "tsconfig-paths-webpack-plugin/lib/options";

interface Mp3LoaderOptions {
  prefix?: string;
}

export default function mp3Loader(
  this: LoaderContext<Mp3LoaderOptions>,
  content: Buffer
) {
  const options = getOptions(this) || {};
  // @ts-ignore
  const {prefix} = options;
  const filename = `${prefix || ''}[name].[hash:8].[ext]`;
  this.emitFile(filename, content);
  return `export default ${JSON.stringify(filename)}`
}
