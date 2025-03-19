const fs = require('fs');
const JSONStream = require('JSONStream');

const filePath = './galaxy_1month.json'; // Large dataset
const outputFilePath = './OutputFiles/populated_systems.jsonl'; // Write results here

// Ensure the output file exists
fs.openSync(outputFilePath, 'a'); // 'a' mode creates the file if it doesn't exist

const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const parser = JSONStream.parse('*');
const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' }); // Append mode

const requiredService = "System Colonisation";

let processedSystems = 0;

// Display progress
function updateProgress() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Populated Systems processed: ${processedSystems}`);
}

console.log("Beginning populated Systems process.");
stream.pipe(parser)
    .on('data', (system) => {
        if (system.population > 0 && Array.isArray(system.stations)) {
            for (const station of system.stations) {
                if (station.services?.includes(requiredService) && station.type !== "Settlement") {
                    // Write system to file immediately (no memory hoarding)
                    outputStream.write(JSON.stringify(system) + '\n');
                    // console.log(`Found: ${system.name}`);

                    processedSystems++;

                    if (system.population === 0 || !system.population) {
                        outputStream.write(JSON.stringify(system) + '\n');
                    }

                    updateProgress();

                    break; // No need to check other stations in this system
                }
            }
        }
    })
    .on('end', () => {
        updateProgress();
        console.log("Finished processing populated systems.");
        outputStream.end();
    })
    .on('error', (err) => console.error('Error:', err));
