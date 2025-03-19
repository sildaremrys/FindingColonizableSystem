# Colonization Script for Elite Dangerous (Spansh Data Dump)

## Prerequisites

To use this script, you need to have the following installed:

- **Node.js** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (Comes with Node.js)

This is all done with the terminal/cmd, just make sure you navidate or open the terminal into this project.

Once Node.js and npm are installed, run the following command to install the required dependency:

```sh
npm install
```

This will install the only required package: `JSONStream`.

## Setting Up the Data

1. Download the `galaxy_1month.json.gz` file from the Spansh data dump:

   - [Spansh Data Dump](https://www.spansh.co.uk/dumps)
   - You can try using a smaller dataset, but it has not been tested.

2. Extract the `galaxy_1month.json.gz` file so that you have `galaxy_1month.json`.

3. Place `galaxy_1month.json` in the same directory as this README file.

## Running the Script

Once the setup is complete, you can run the following commands:

### 1. Find Populated Systems

```sh
npm run pop
```

Wait until it displays **"Finished processing populated systems."**

### 2. Find Unpopulated Systems

```sh
npm run unpop
```

Wait until it displays **"Finished processing unpopulated systems."**

### 3. Find Candidate Systems

```sh
npm run findCandidates
```

While this runs, the terminal will display **"Systems found"** as it processes. Alternatively, you can wait for the output file to finish generating.

## Output Files

All results will be stored in the `OutputFiles/` directory.

## Notes

Regarding the `galaxy_1month.json.gz` file

--The Unpopulated systems is around ~ 3 331 631
--The Populated systems is around ~ 15 891

This isn't as detailed as most of you would like, regarding search features and this isnt the most optimised scripts so please be advised that this requires about ~50gb of free space since we already have a 21 gb file for the galaxy and then we are split it up.

Also these script is primairly designed to find gas giants with rings which container spots that you are looking for, by default i have it as such

```sh
const searchCriteria = {
    types: ["Planet"],
    subTypes: ["gas giant"],
    hasRings: true,
    targetMaterials: ["Alexandrite"]
};
const maxDistance = 16; // Light-years
```

## Support & Donations

If you found this script useful and would like to support its development, consider making a donation. With enough support, I wil be able to create a website where users can search for candidate systems easily.

Your support is greatly appreciated!

https://www.paypal.com/donate/?hosted_button_id=Z28EZMHG4CG5A
