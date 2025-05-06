module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^react-lottie$": "<rootDir>/__mocks__/react-lottie.js"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)"
    ],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
  };
  