const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const envPath = path.resolve(__dirname, "../../.env");
const envExamplePath = path.resolve(__dirname, "../../.env.example");

// check if .env exists, if not create it
if(!fs.existsSync(envPath)) {
    console.log("Env file not found, creating file");
    fs.writeFileSync(envPath, fs.readFileSync(envExamplePath));
}

// read env and check if JWT_SECRET exist, if not generate random one
let fileContents = fs.readFileSync(envPath);
let envExample = dotenv.parse(fileContents);

if(!envExample.JWT_SECRET) {
    console.log("Genereting JWT_SECRET");
    let secret = bcrypt.genSaltSync(10);
    fs.appendFileSync(envPath, ` \n#Auto generated JWT_SECRET \nJWT_SECRET = '${secret}'`);    
}


console.log("Nothing more to do");
