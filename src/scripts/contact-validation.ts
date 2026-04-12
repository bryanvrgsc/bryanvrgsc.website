export const validateContactFields = (fields: {
  name: string;
  email: string;
  message: string;
}) => {
  const email = fields.email.trim();

  const emailValid =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email) &&
    !email.includes('..');

  return {
    name: fields.name.trim() ? undefined : 'required',
    email: !email
      ? 'required'
      : emailValid
        ? undefined
        : 'invalid',
    message: fields.message.trim() ? undefined : 'required',
  };
};
