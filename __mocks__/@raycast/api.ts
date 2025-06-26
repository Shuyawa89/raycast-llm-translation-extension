export const Action = jest.fn();
export const ActionPanel = jest.fn(({ children }) => children);
export const Form = jest.fn(({ children }) => children);
export const List = jest.fn(({ children }) => children);
export const Detail = jest.fn();
export const LocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
export const showToast = jest.fn();
export const Toast = {
  Style: {
    Animated: "animated",
    Success: "success",
    Failure: "failure",
  },
};
export const confirmAlert = jest.fn();
export const getSelectedText = jest.fn();
