import { toast } from "react-toastify";

const statusMessages = {
  400: "The request is invalid.",
  401: "You are not authorized. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  500: "A server error occurred. Please try again later.",
};

const getValidationMessages = (errors) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors
    .map((error) => (typeof error === "string" ? error : error?.message))
    .filter((message) => typeof message === "string" && message.trim());
};

export const showApiError = (error) => {
  const response = error?.response;
  const data = response?.data;
  const validationMessages = getValidationMessages(data?.errors);

  if (validationMessages.length > 0) {
    validationMessages.forEach((message) => toast.error(message));
    return validationMessages;
  }

  const message =
    data?.message ||
    statusMessages[response?.status] ||
    (response
      ? "The request could not be completed."
      : "Unable to connect to the server. Check your internet connection and try again.");

  toast.error(message);
  return [message];
};
