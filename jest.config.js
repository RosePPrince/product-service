module.exports = {
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'models'],
    moduleNameMapper: {
      '^models/(.*)$': '<rootDir>/models/$1'
    }
  };
  