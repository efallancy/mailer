import joi from '@hapi/joi';

export const sendMailBodyRequestSchema = joi
  .object()
  .keys({
    from: joi
      .string()
      .email()
      .required(),
    to: joi
      .array()
      .items(joi.string().email())
      .unique()
      .required(),
    cc: joi
      .array()
      .items(joi.string().email())
      .unique(),
    bcc: joi
      .array()
      .items(joi.string().email())
      .unique(),
    subject: joi.string().required(),
    content: joi.string().required(),
  })
  .required();
