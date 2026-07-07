import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildIndex = path.join(__dirname, 'build', 'index.js');

if (fs.existsSync(buildIndex)) {
	console.log('Post-processing build/index.js to change default port to 3020...');
	let content = fs.readFileSync(buildIndex, 'utf8');
	content = content.replace("!path && '3000'", "!path && '3020'");
	fs.writeFileSync(buildIndex, content, 'utf8');
	console.log('Successfully set default build port to 3020.');
} else {
	console.error('build/index.js not found!');
}
