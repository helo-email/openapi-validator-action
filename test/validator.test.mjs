import { jest } from '@jest/globals';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../');

const mockSetFailed = jest.fn();
jest.unstable_mockModule('@actions/core', () => ({
    setFailed: mockSetFailed,
    getInput: jest.fn(),
}));

const { default: validate } = await import('../src/validator.mjs');

beforeEach(() => {
    mockSetFailed.mockClear();
    process.env.GITHUB_WORKSPACE = projectRoot;
});

test('accepts a valid OpenAPI v3 schema', async () => {
    await validate('./schemas/openapiv3.yml');
    expect(mockSetFailed).not.toHaveBeenCalled();
});

test('calls setFailed for a schema with an unresolved $ref', async () => {
    await validate('./schemas/invalid-openapi.yml');
    expect(mockSetFailed).toHaveBeenCalledWith('API specification is invalid');
});

test('throws when filePath is not a string', async () => {
    await expect(validate(42)).rejects.toThrow('path is not string');
});
