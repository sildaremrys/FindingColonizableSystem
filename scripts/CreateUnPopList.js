const fs = require('fs');
const JSONStream = require('JSONStream');

const filePath = './galaxy_1month.json'; // Large dataset
const outputFilePath = './OutputFiles/unpopulated_systems.jsonl'; // Write results here

// Ensure the output file exists
fs.openSync(outputFilePath, 'a'); // 'a' mode creates the file if it doesn't exist

const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const parser = JSONStream.parse('*');
const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' }); // Append mode

let processedSystems = 0;

// Display progress
function updateProgress() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Unpopulated Systems processed: ${processedSystems}`);
}

console.log("Beginning Unpopulated Systems process.");
stream.pipe(parser)
    .on('data', (system) => {
        if (system.population === 0 || !system.population) {
            processedSystems++;
            outputStream.write(JSON.stringify(system) + '\n'); // Write system once
        }

        if (processedSystems % 1000 === 0) updateProgress(); // Update every 1000 systems
    })
    .on('end', () => {
        updateProgress();
        console.log("Finished processing unpopulated systems.");
        outputStream.end();
    })
    .on('error', (err) => console.error('Error:', err));
