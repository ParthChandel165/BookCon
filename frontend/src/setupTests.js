// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock CSS imports
jest.mock('./App.css', () => ({}), { virtual: true });

// Mock any other problematic imports
jest.mock('react-lottie', () => {
  return function DummyLottie(props) {
    return <div data-testid="lottie-animation">Lottie Animation Mocked</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => '[]'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock import.meta.env for Vite environment variables
if (typeof global.import === 'undefined') {
  global.import = {
    meta: {
      env: {
        VITE_API_URL: 'http://test-api-url.com',
        REACT_APP_RAZORPAY_KEY_ID: 'test-razorpay-key',
        MODE: 'test'
      }
    }
  };
}

// Mock Razorpay
jest.mock('react-razorpay', () => ({
  useRazorpay: () => ({
    error: null,
    isLoading: false,
    Razorpay: jest.fn().mockImplementation(() => ({
      open: jest.fn()
    }))
  })
}));

// Mock window.alert
global.alert = jest.fn();

// Mock navigate function
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));