// If no PORT then we're in development and we get it from config
if (!process.env.PORT) {
	require('dotenv').config();
}

// dotenv adds these to process.env
const { PORT, APP_NAME } = process.env;

const { createServer } = require('http');

const serveStaticFile = require('../lib/serveStaticFile');

module.exports = () => {
	// Create HTTP server
	const server = createServer(async ({ url }, response) => {
		// Get file extension from URL, split by "."
		const urlTokens = url.split('.');
		// Makes sure that extension is in lowercase with no unneeded characters
		const extension = urlTokens.length > 1 ? `${urlTokens[urlTokens.length - 1].toLowerCase().trim()}` : false;
		// If app is running on root, serve index.html else the url
		const isRoot = ['', '/'].indexOf(url) > -1;
		const path = isRoot ? '/index.html' : url;

		try {
			return await serveStaticFile({ file: path, extension: isRoot ? 'html' : extension }, response);
		} catch (error) {
			console.error(error);
			return await serveStaticFile(
				{
					file: '/error.html',
					extension: 'html',
					statusCode: 500,
				},
				response
			);
		}
	});

	// This func is for debugging purposes: shows bugs when request crashes
	server.on('request', ({ method, url }) => {
		const now = new Date();
		console.info(`=> ${now.toUTCString()} - ${method} ${url}`);
	});

	// Actively listens to PORT so server stays running
	server.listen(PORT, () => {
		console.log(`=> ${APP_NAME} running on port ${PORT}`);
	});
};
