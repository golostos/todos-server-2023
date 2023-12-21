/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cache: true,
  // use path aliases from tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // use __tests__ folder for tests
  testMatch: ['**/__tests__/**/*.test.ts'],
}
