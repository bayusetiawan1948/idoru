import JoiBase from 'joi';
import JoiDate from '@joi/date';
const Joi = JoiBase.extend(JoiDate);

const memberSchema = Joi.object({
  name: Joi.string().min(3).max(35).required().messages({
    'string.base': 'Nama harus berupa huruf',
    'string.min': 'Masukan nama minimal 5 huruf',
    'string.max': 'Masukan nama maximal 35 huruf',
    'string.empty': 'Masukan nama member',
    'any.required': 'Masukan nama member',
  }),
  username: Joi.string().min(5).max(35).required().messages({
    'string.base': 'username harus berupa huruf',
    'string.min': 'Masukan username minimal 5 huruf',
    'string.max': 'Masukan username maximal 35 huruf',
    'string.empty': 'Masukan username member',
    'any.required': 'Masukan username member',
  }),
  jikoshoukai: Joi.string().min(5).max(100).required().messages({
    'string.base': 'jikoshoukai harus berupa huruf',
    'string.min': 'Masukan jikoshoukai minimal 5 huruf',
    'string.max': 'Masukan jikoshoukai maximal 100 huruf',
    'string.empty': 'Masukan jikoshoukai member',
    'any.required': 'Masukan jikoshoukai member',
  }),
  birth_date: Joi.date().utc().format('DD-MM-YYYY').required().messages({
    'date.format': 'Masukan tanggal lahir sesuai format',
    'any.required': 'Masukan tanggal lahir member',
  }),
  joined_at: Joi.date().utc().format('DD-MM-YYYY').required().messages({
    'date.format': 'Masukan tanggal masuk sesuai format',
    'any.required': 'Masukan tanggal masuk member',
  }),
  blood_type: Joi.string().valid('A', 'B', 'O', 'AB').required().messages({
    'any.required': 'Masukan golongan darah member',
    'any.only': 'Masukan golongan darah sesuai ketentuan',
  }),
  body_height: Joi.number().min(1).max(300).required().messages({
    'number.min': 'Masukan tinggi badan minimal 1 angka',
    'number.max': 'Masukan tinggi badan maximal 300 angka',
    'any.required': 'Masukan tinggi badan member',
  }),
  generation: Joi.number().min(1).max(50).required().messages({
    'number.min': 'Masukan generasi minimal 1 angka',
    'number.max': 'Masukan generasi maximal 3 angka',
    'any.required': 'Masukan generasi member',
  }),
});

export default { memberSchema };
