// Func to open file
const { open } = require('fs').promises;
// Look up content-type
const { lookup } = require('mime-types');

const { STATIC_EXTENSIONS } = require('../config/constants');

const serveStaticFile = async ({ file, extension, statusCode }, response) => {
	// Show error if the file type isn't accessible to app
	if (STATIC_EXTENSIONS.indexOf(extension) === -1) throw new Error('not_found');

	let fileHandle;

	try {
		// Open file so it can only be read
		fileHandle = await open(`./public/${file}`, 'r');
		// Actually reading the file
		const staticFile = await fileHandle.readFile();

		// If filetype is not found send error to user, else write in response head
		const mime = lookup(extension);
		if (!mime) {
			throw new Error('not_found');
		}

		response.writeHead(statusCode || 200, {
			'Content-Type': mime,
		});

		return response.end(staticFile);
	} catch (error) {
		console.error(error);
		// Show user different error that makes sense to them
		throw new Error('not_found');
	} finally {
		// "finally" executes regardless of error
		if (fileHandle) fileHandle.close(); // Close FS after each response
	}
};

module.exports = serveStaticFile;
