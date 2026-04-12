export const validateContactFields = (fields: {
  name: string;
  email: string;
  message: string;
}) => {
  const email = fields.email.trim();

  return {
    name: fields.name.trim() ? undefined : 'required',
    email: !email
      ? 'required'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? undefined
        : 'invalid',
    message: fields.message.trim() ? undefined : 'required',
  };
};
