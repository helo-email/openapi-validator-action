import { setFailed } from '@actions/core';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import SwaggerParser from "@apidevtools/swagger-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const validate = async (filePath) => {
    if (typeof filePath !== 'string') {
        throw Error("path is not string")
    }
    const dir = process.env.GITHUB_WORKSPACE || __dirname
    const fullPath = resolve(dir, filePath)
    console.log(`schema file full path:${fullPath}`)
    try {
        await SwaggerParser.validate(fullPath, { continueOnError: true })
        console.log("API specification is  valid ")
    }
    catch (err) {
        console.error(err.message);
        setFailed("API specification is invalid")
    }
}

export default validate