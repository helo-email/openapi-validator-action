import { getInput, setFailed } from '@actions/core';
import validate from './validator.mjs';

try {
    const filePath = getInput('filepath');
    console.log(`file path ${filePath}`);
    validate(filePath)
} catch (error) {
    setFailed(error.message);
}
