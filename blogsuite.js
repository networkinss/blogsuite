// this file contains the javascript cli functions for the blog suite
// command line interface
const availableCommands = [
    {
        name: 'help',
        description: 'displays this help message',
        usage: 'help'
    },
    {
        name: 'create',
        description: 'creates a new blog article',
        usage: 'create'
    },
    {
        name: 'list',
        description: 'lists all blog articles',
        usage: 'list'
    },
    {
        name: 'delete',
        description: 'deletes one blog article',
        usage: 'delete'
    },
    {
        name: 'generate-list',
        description: 'generates a list of all blog articles',
        usage: 'generate-list'
    }
];


const articlesPath = 'src/assets/articles';
const binaryFileName = 'filestore.bin';
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

const help = () => {
    console.log('Available commands:');
    availableCommands.forEach((command) => {
        console.log(`${command.name}: ${command.description}`);
        console.log(`Usage: ${command.usage}`);
    });
};

const create = () => {
    console.log(`Creating blog article:`);
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // add a 0 in front of the month and day if they are smaller than 10
    if (month < 10) {
        month = `0${month}`;
    }

    if (day < 10) {
        day = `0${day}`;
    }
    // const fs = require('fs');
    // const path = require('path');

    // get the title of the blog article
    const readline = require('readline-sync');
    const title = readline.question('Enter the title of the blog article: ');
    // convert the title to lowercase and replace spaces with undescores
    const fileTitle = title.toLowerCase().replace(/ /g, '_');
    const fileName = `${day}-${month}-${year}-${fileTitle}.md`;
    const filePath = path.join(getArticlesPath(), fileName);
    if (fs.existsSync(filePath)) {
        console.error("File " + filePath + "already exists. No new file was created.");
        return;
    }

    // read the short description of the blog article
    const description = readline.question('Enter a short description of the blog article: ');


    const fileContent =
        `Title: ${title}` + '\n' +
        `Description: ${description}` + '\n' +
        `Date: ${day}-${month}-${year}` + '\n' +
        `Author: Not specified` + '\n' +
        `---` + '\n' +
        `Change this content to your liking` + '\n';

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Successfully created file: ${fileName}`);

        // check if the user wants to update the list.json file
        const updateList = readline.question('Do you want to update the list.json file? (y/n): ');
        if (updateList === 'y') {
            generateList();
        }
    });
};

const list = () => {
    console.log('Listing all blog articles:');
    // const fs = require('fs');
    // const path = require('path');
    const files = fs.readdirSync(getArticlesPath());

    // exclude the list.json file
    files.splice(files.indexOf('list.json'), 1);
    if (files.length === 0) {
        console.log("No entries yet. Use \"create\" for a new article.");
        return;
    }
    files.forEach((file) => {
        console.log(file);
    });
};

const getArticlesPath = () => {
    // const fs = require('fs');
    // const path = require('path');
    const rootPath = path.join(__dirname, articlesPath);
    console.log("RootPath: " + rootPath);
    if (!fs.existsSync(rootPath)) {
        const readlineSync = require('readline-sync');
        const shallCreateDir = readlineSync.question(`${rootPath} does not exist. Do you want to create it? (yes/no) `);

        if (shallCreateDir.toLowerCase() === 'yes' || shallCreateDir.toLowerCase() === 'y') {
            fs.mkdirSync(rootPath, {recursive: true});
            console.log(`Created the directory: ${rootPath}`);
        } else {
            throw new Error('Directory does not exist.');
        }
    }
    return rootPath;
};


const deleteArticle = () => {
    console.log(`Choose blog article to delete:`);
    // const fs = require('fs');
    // const path = require('path');
    const articlesPath = path.join(getArticlesPath());
    const files = fs.readdirSync(articlesPath);

    // exclude the list.json file
    files.splice(files.indexOf('list.json'), 1);

    // display all files with their index
    files.forEach((file, index) => {
        console.log(`${index}: ${file}`);
    });

    // get the id of the file to delete
    const readline = require('readline-sync');
    const id = readline.question('Enter the id of the file to delete: ');

    // delete the file with the given id
    const fileToDelete = files[id];
    const filePath = path.join(articlesPath, fileToDelete);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Successfully deleted file: ${fileToDelete}`);
    });
};

const generateList = () => {
    console.log('Generating list of all blog articles:');
    // const fs = require('fs');
    // const path = require('path');
    const articlesPath = getArticlesPath();
    const files = fs.readdirSync(articlesPath);
    const index = files.indexOf('list.json');
    if (index !== -1) {
        files.splice(index, 1);
    }

    const listPath = path.join(articlesPath + '/list.json');
    const list = [];
    files.forEach((file) => {
        // open the file and read the title and 120 first characters of the content
        const filePath = path.join(articlesPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const title = fileContent.split('\n')[0].split(':')[1].trim();
        const description = fileContent.split('\n')[1].split(':')[1].trim();
        list.push({
            title,
            description,
            slug: file.replace('.md', '')
        });
    });

    // write the list to the list.json file
    fs.writeFile(listPath, JSON.stringify(list, null, 2), (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Successfully generated list');
    });
};

/* Start with filling files. */


function storeFilesInBinary() {
    // const binaryFileName = 'combined.bin';

    const inputDir = readlineSync.question('Enter the path of the directory: ');

    if (!fs.existsSync(inputDir) || !fs.lstatSync(inputDir).isDirectory()) {
        console.log("Invalid directory!");
        return;
    }

    let allFilesBuffer = [];

    if (fs.existsSync(binaryFileName)) {
        allFilesBuffer.push(fs.readFileSync(binaryFileName));
    }

    const filesAndDirs = fs.readdirSync(inputDir);

    for (const item of filesAndDirs) {
        const itemPath = path.join(inputDir, item);
        if (fs.lstatSync(itemPath).isFile()) {
            const fileBuffer = fs.readFileSync(itemPath);
            appendFileToBuffer(allFilesBuffer, item, fileBuffer);
        } else {
            const subFiles = fs.readdirSync(itemPath);
            for (const subFile of subFiles) {
                const subFilePath = path.join(itemPath, subFile);
                if (fs.lstatSync(subFilePath).isFile()) {
                    const fileBuffer = fs.readFileSync(subFilePath);
                    appendFileToBuffer(allFilesBuffer, path.join(item, subFile), fileBuffer);
                }
            }
        }
    }

    fs.writeFileSync(binaryFileName, Buffer.concat(allFilesBuffer));
    console.log('All files from', inputDir, 'have been stored in', binaryFileName);
}

function appendFileToBuffer(bufferArray, relativePath, fileBuffer) {
    const fileNameBuffer = Buffer.from(relativePath, 'utf-8');
    const fileLengthBuffer = Buffer.alloc(4);
    fileLengthBuffer.writeUInt32LE(fileBuffer.length);

    bufferArray.push(fileNameBuffer, Buffer.from([0]), fileLengthBuffer, fileBuffer);
}

function retrieveFilesFromBinary() {
    // const binaryFileName = 'combined.bin';
    const outputDir = readlineSync.question('Enter the output directory path: ');

    if (!fs.existsSync(outputDir)) {
        console.log("Output directory doesn't exist. Creating...");
        fs.mkdirSync(outputDir, {recursive: true});
    }

    const combinedBuffer = fs.readFileSync(binaryFileName);

    let offset = 0;

    while (offset < combinedBuffer.length) {
        const fileNameLength = combinedBuffer.indexOf(Buffer.from([0]), offset) - offset;
        const relativePath = combinedBuffer.slice(offset, offset + fileNameLength).toString('utf-8');
        offset += fileNameLength + 1;

        const fileLength = combinedBuffer.readUInt32LE(offset);
        offset += 4;

        const fileBuffer = combinedBuffer.slice(offset, offset + fileLength);
        offset += fileLength;

        const outputPath = path.join(outputDir, relativePath);

        // Ensure that the directory exists
        const parentDirectory = path.dirname(outputPath);
        if (!fs.existsSync(parentDirectory)) {
            fs.mkdirSync(parentDirectory, {recursive: true});
        }

        fs.writeFileSync(outputPath, fileBuffer);
    }

    console.log('All files and folder structures have been restored to', outputDir);
}

const command = process.argv[2];
switch (command) {
    case 'help':
        help();
        break;
    case 'create':
        create();
        break;
    case 'list':
        list();
        break;
    case 'delete':
        deleteArticle();
        break;
    case 'generate-list':
        generateList();
        break;
    case 'fill':
        fill();
        break;
    case 'storedir':
        storeFilesInBinary();
        break;
    case 'restoredir':
        retrieveFilesFromBinary();
        break;
    default:
        console.log(`Unknown command: ${command} please use the help command to see all available commands`);
        break;
}
