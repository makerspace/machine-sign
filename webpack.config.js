const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const transformInferno = require('ts-transform-inferno').default
const transformClasscat = require('ts-transform-classcat').default

module.exports = (env, args) => {
	const commonSettings = {
		context: path.resolve(__dirname),
		entry: {
			main: "./src/main.tsx",
		},
		
		output:
			{
				filename: "[name].js",
				path: path.resolve(__dirname, "dist/js"),
			},
		
		module: {
			rules: [
				{
					test: /\.(ts)$/,
					exclude: /node_modules/,
					use: ['ts-loader'],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						// Creates `style` nodes from JS strings
						// fallback to style-loader in development
						args.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader',
					],
				  },
				  {
					test: /\.tsx$/,
					loader: 'ts-loader',
					options: {
					  getCustomTransformers: () => ({
						before: [transformInferno()],
					  }),
					},
				  },
			]
		},
		
		resolve: {
			extensions: ['*', '.ts', '.tsx', '.js', '.scss']
		},
		
		plugins: [
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
		],
	};
	
	if (args.mode === 'development') {
		console.info("webpack development mode");
		
		return merge(commonSettings, {
			mode: "development",
			devtool: "inline-source-map",
			plugins: [
			],
			devServer: {
				host: "0.0.0.0",
				port: 80,
				public: 'http://localhost:8000',
				publicPath: '/static/js',
				proxy: {
					'/': 'http://localhost:81',
				}
			},
		});
	} else {
		console.info("webpack production mode");
		
		return merge(commonSettings, {
			mode: "production",
			devtool: "source-map",
			plugins: [
				new webpack.LoaderOptionsPlugin({
					minimize: true,
				}),
			],
		});
	}
};