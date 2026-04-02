export const validateContactFields = (fields: {
  name: string;
  email: string;
  message: string;
}) => {
  return {
    name: fields.name.trim() ? undefined : 'required',
    email: !fields.email.trim()
      ? 'required'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
        ? undefined
        : 'invalid',
    message: fields.message.trim() ? undefined : 'required',
  };
};
