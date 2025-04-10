import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import ViteYaml from "@modyfi/vite-plugin-yaml";

import { 
    begin,
    end,
    ignore,
    non_capturing_group,
    one_or_more,
    any_number_of
} from "./scripts/regex";

// Adapted from https://github.com/vitejs/vite/issues/6596#issuecomment-1651355986
// Note (vite dev): This plugin adds trailing slash.
// Note (vite preview): Nothing happens.
// Note (GitHub Pages): GitHub Pages adds trailing slash itself in the browser.
//                      https://github.com/slorber/trailing-slash-guide
const AppendTrailingUrlSlash = () => {
    return {
        name: "append-trailing-url-slash",
        apply: "serve",
        enforce: "post",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url) {
                    return next();
                }
                const regexp = new RegExp(
                    begin +
                        "/" +
                        any_number_of(non_capturing_group(
                            one_or_more(ignore("@")) + "/"
                        )) +
                        one_or_more(ignore("@./")) +
                        end,
                    "g",
                );
                if (regexp.test(req.url)) {
                    const MOVED_PERMANENTLY = 301;
                    res.writeHead(MOVED_PERMANENTLY, { Location: req.url + "/" });
                    res.end();
                    return;
                }
                next();
            });
        },
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    appType: "mpa", // Multi-page application.
    base: "/eberban/",
    build: {
        // The output directory is specified within package.json via Vite CLI.
        rollupOptions: {
            input: {
                "main": resolve(__dirname, "index.html"),
                "dictionary": resolve(__dirname, "dictionary/index.html"),
                "root-generator": resolve(__dirname, "root-generator/index.html"),
                "textual-parser": resolve(__dirname, "textual-parser/index.html"),
                "visual-parser": resolve(__dirname, "visual-parser/index.html"),
                // The reference grammar is within this repo but external to
                // this web application, so it is not listed as an input.
            },
        },
    },
    plugins: [AppendTrailingUrlSlash(), ViteYaml()],
    // The root is specified within package.json scripts via Vite CLI.
    publicDir: "../images",
});
