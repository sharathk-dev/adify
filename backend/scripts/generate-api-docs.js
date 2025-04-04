import fs from 'fs';
import swagger from '../utils/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path for the output file
const outputPath = path.join(__dirname, '../api-docs.json');

// Generate the Swagger documentation
const swaggerSpec = swagger.specs;

// Save the Swagger documentation to a file
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`OpenAPI documentation has been generated at ${outputPath}`);
console.log('You can import this file into tools like Swagger UI, Postman, or Insomnia'); 