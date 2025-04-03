const fs = require('fs');
const readline = require('readline');

const populatedFile = './OutputFiles/populated_systems.jsonl';
const unpopulatedFile = './OutputFiles/unpopulated_systems.jsonl';
const outputFile = './OutputFiles/colonization_candidates.jsonl';

// Here is your Criteria (Sorry I didnt make it more detail such as finding if planets are landable or terraformable but i can do it at a later date if it is something people want)
const searchCriteria = {
    types: ["Planet"],
    subTypes: ["gas giant"],
    hasRings: true,
    targetMaterials: ["Alexandrite"],
    bodyCount: 30,
	distanceToArrival: 100000
};
const maxDistance = 16; // Light-years
const requiredService = "System Colonisation";

// Create a Set to store populated system coordinates
async function loadPopulatedSystemCoords() {
    const populatedCoords = new Set();
    const fileStream = fs.createReadStream(populatedFile, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
        try {
            const system = JSON.parse(line);
            if (system.coords && system.stations?.some(station =>
                Array.isArray(station.services) &&
                station.services.includes(requiredService)
            )) {
                populatedCoords.add(JSON.stringify(system.coords)); // Store as a string for quick lookup
            }
        } catch (err) {
            console.error(`Error processing populated system: ${err.message}`);
        }
    }

    return populatedCoords;
}

// Calculate distance between two systems
function getDistance(coords1, coords2) {
    const dx = coords1.x - coords2.x;
    const dy = coords1.y - coords2.y;
    const dz = coords1.z - coords2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Process unpopulated systems and find colonization candidates
async function findColonizationCandidates() {
    console.log("Looking for Candidates.");
    const populatedCoords = await loadPopulatedSystemCoords();
    const writeStream = fs.createWriteStream(outputFile, { flags: 'w' });
    const fileStream = fs.createReadStream(unpopulatedFile, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let systemCount = 0;
    let planetCount = 0;
    let candidateCount = 0;
    let candidateNames = [];

    for await (const line of rl) {
        try {
            const system = JSON.parse(line);
            systemCount++;
            if (!system.coords || !system.bodies) continue;
            let planetsChecked = 0;
            for (const popCoord of populatedCoords) {
                const popCoords = JSON.parse(popCoord); // Convert back from string
                const distance = getDistance(system.coords, popCoords);

                if (distance <= maxDistance) {
                    planetsChecked += system.bodies.length;

                    if (meetsAllCriteria(system, searchCriteria)) {
                        candidateCount++;
                        candidateNames.push(system.name);
                        console.log(`✅ Candidate Found: ${system.name}`);
                        writeStream.write(JSON.stringify({ name: system.name }) + '\n');
                        break;
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing unpopulated system: ${err.message}`);
        }
    }

    writeStream.end();
    console.log('✅ Processing complete. Results saved to:', outputFile);
}

//Check to see if the specified planet subTypes are present in the system
function matchPlanets(body, criteria) {
    if (criteria.types && !criteria.types.includes(body.type)) return false;
    if (criteria.subTypes && !criteria.subTypes.every(sub => body.subType?.includes(sub))) return false;
    return true;
}

//Check to see if the system contains rings with the specified hot spots
function matchRings(signals, criteria) {
    if(!criteria.targetMaterials.some(mat => signals.signals[mat])) return false;
    return true;
}

//Check to see if all bodies are within the specified distance of the drop point
function matchAllBodies(body, criteria) {
    if (criteria.distanceToArrival && body.distanceToArrival < criteria.distanceToArrival) return true;
}

//Check to see if all criteria have been met
function meetsAllCriteria(system, criteria) {
    //	if (criteria.bodyCount && system.bodyCount && system.bodyCount < criteria.bodyCount) return false;
    //	if (!system.bodies.some(body => matchPlanets(body, criteria))) return false;
    //oldRings	if (criteria.hasRings && !system.bodies.body.rings.some(ring => matchRings(ring, criteria))) return false;
    if (criteria.hasRings && !system.bodies.body?.rings?.ring.signals?.some(signals => matchRings(signals, criteria))) return false;
    //	if (!system.bodies.every(body => matchAllBodies(body, criteria))) return false;
    return true;
}

findColonizationCandidates().catch(console.error);
