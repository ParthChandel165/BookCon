module.exports = {
    "jest": {
      "setupFilesAfterEnv": [
        "<rootDir>/src/setupTests.js"
      ],
      "transform": {
        "^.+\\.(js|jsx)$": "babel-jest"
      },
      "transformIgnorePatterns": [
        "node_modules/(?!react-lottie|lottie-web)/"
      ],
      "moduleNameMapper": {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
        "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
        "^@/(.*)$": "<rootDir>/src/$1"
      },
      "testEnvironment": "jsdom"
    }
  }
  