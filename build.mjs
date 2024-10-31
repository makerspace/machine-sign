import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const prod = process.env.NODE_ENV === 'production';
const ctx = await esbuild.context({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    minify: prod,
    sourcemap: true,
    target: ['es2020'],
    plugins: [sassPlugin()],
    outdir: './dist/js',
});

if (prod || true) {
    await ctx.rebuild();
    console.log('Build succeeded.');
    process.exit(0);
} else {
    let { host, port } = await ctx.serve({
        servedir: 'dist',
        onRequest: () => {
        }
    });

    console.log('Build succeeded. Serving on http://' + host + ':' + port);
    console.log("Watching for changes...");
}
