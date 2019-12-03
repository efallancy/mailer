import joi from '@hapi/joi';

export const sendMailBodyRequestSchema = joi
  .object()
  .keys({
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
    content: joi.string().required(),
  })
  .required();
