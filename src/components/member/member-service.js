import { validate } from '../../validation/validation.js';
import { camelCaseConvert, generateId, saveUpdate } from '../../app/utils.js';
import { query } from '../../app/database.js';
import memberSchema from './member-validation.js';
import moment from 'moment';
import { ResponseError } from '../../error/response-error.js';
import { unlink } from 'node:fs';

const PORT = process.env['PRIMARYPORT'] || 5000;
const DOMAIN = '127.0.0.1';

const getZodiac = (date) => {
  let zodiac = '';
  const monthDate = moment(date).format('MM-DD');

  switch (true) {
    case monthDate >= '03-21' && monthDate <= '04-19':
      zodiac = 'Aries';
      break;
    case monthDate >= '04-20' && monthDate <= '05-20':
      zodiac = 'Taurus';
      break;
    case monthDate >= '05-21' && monthDate <= '06-21':
      zodiac = 'Gemini';
      break;
    case monthDate >= '06-22' && monthDate <= '07-22':
      zodiac = 'Cancer';
      break;
    case monthDate >= '07-23' && monthDate <= '08-22':
      zodiac = 'Leo';
      break;
    case monthDate >= '08-23' && monthDate <= '09-22':
      zodiac = 'Virgo';
      break;
    case monthDate >= '09-23' && monthDate <= '10-23':
      zodiac = 'Libra';
      break;
    case monthDate >= '10-24' && monthDate <= '11-21':
      zodiac = 'Scorpion';
      break;
    case monthDate >= '11-22' && monthDate <= '12-21':
      zodiac = 'Sagittarius';
      break;
    case monthDate >= '12-22' && monthDate <= '01-19':
      zodiac = 'Capricon';
      break;
    case monthDate >= '01-20' && monthDate <= '02-18':
      zodiac = 'Aquarius';
      break;
    case monthDate >= '02-19' && monthDate <= '03-20':
      zodiac = 'Pisces';
      break;
  }

  return zodiac;
};

const renewDataMembers = (dataObj) => {
  const result = dataObj.map((tmp) => {
    const container = {};
    container.member_id = tmp.member_id;
    container.nama = tmp.name;
    container.username = tmp.username;
    container.body_height = tmp.body_height;
    container.generation = tmp.generation;
    container.horoscopes = tmp.horoscopes;
    container.birth_date = moment(tmp.birth_date).format('DD-MM-YYYY');
    container.blood_type = tmp.blood_type;
    container.jikoshoukai = tmp.jikoshoukai;
    container.image_profile =
      DOMAIN + ':' + PORT + '/images/' + tmp.image_profile;
    container.social_media = JSON.parse(tmp.social_media);
    container.joined_at = moment(tmp.joined_at).format('DD-MM-YYYY');

    return container;
  });

  return result;
};

const createMember = async (reqBody, reqFiles) => {
  const inputCheck = validate(memberSchema.memberSchema, reqBody);
  let {
    name,
    username,
    jikoshoukai,
    birth_date,
    blood_type,
    body_height,
    generation,
    social_media,
    joined_at,
  } = inputCheck;

  name = camelCaseConvert(name);
  username = camelCaseConvert(username);
  blood_type = camelCaseConvert(blood_type);
  jikoshoukai = jikoshoukai[0].toUpperCase() + jikoshoukai.slice(1);
  birth_date = moment(birth_date).format('YYYY-MM-DD');
  joined_at = moment(joined_at).format('YYYY-MM-DD');
  let images = 'jeketi-default-red.png';
  const horoscopes = getZodiac(birth_date);
  const member_id = generateId();
  const is_active = 1;
  const created_at = moment().format('YYYY-MM-DD hh:mm:ss');

  if (social_media === undefined) {
    social_media = JSON.stringify('');
  } else {
    social_media =
      typeof social_media === 'object'
        ? JSON.stringify(social_media)
        : social_media;
  }

  if (reqFiles !== undefined) {
    const imageName = moment().unix() + '.png';
    reqFiles.mv('./public/images/' + imageName);
    images = imageName;
  }

  const statementMember =
    'INSERT INTO `member`(`member_id`, `name`, `username`, `generation`, `birth_date`, `blood_type`, `horoscopes`, `jikoshoukai`, `body_height`, `image_profile`, `is_active`, `social_media`, `joined_at`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const result = await query(statementMember, [
    member_id,
    name,
    username,
    generation,
    birth_date,
    blood_type,
    horoscopes,
    jikoshoukai,
    body_height,
    images,
    is_active,
    social_media,
    joined_at,
    created_at,
  ]);
  return result;
};

const getMembers = async () => {
  const statementMember = `SELECT member_id, name, username, generation, birth_date, blood_type, horoscopes, jikoshoukai, body_height, image_profile, social_media, joined_at FROM member WHERE is_active = 1 ORDER BY created_at DESC;`;
  const result = await query(statementMember);
  const dataRenew = renewDataMembers(result);
  return dataRenew;
};

const getSingleMember = async (memberId) => {
  if (memberId === undefined) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  const statementMember = `SELECT member_id, name, username, generation, birth_date, blood_type, horoscopes, jikoshoukai, body_height, image_profile, social_media, joined_at FROM member WHERE is_active = 1 AND member_id = ?`;
  const result = await query(statementMember, [memberId]);

  if (result === undefined || result.length == 0) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  const dataRenew = renewDataMembers(result);
  return dataRenew[0];
};

const updateMember = async (reqBody, reqFiles = undefined, memberId) => {
  if (memberId === undefined) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  const statementMember = `SELECT name, username, generation, birth_date, blood_type, jikoshoukai, body_height, is_active, image_profile, social_media, joined_at, is_active FROM member WHERE is_active = 1 AND member_id = ?`;
  const resultCheck = await query(statementMember, [memberId]);

  if (resultCheck === undefined || resultCheck.length == 0) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  let {
    name,
    username,
    generation,
    birth_date,
    blood_type,
    jikoshoukai,
    body_height,
    is_active,
    image_profile,
    social_media,
    joined_at,
  } = saveUpdate(reqBody, resultCheck[0]);
  name = camelCaseConvert(name);
  username = camelCaseConvert(username);
  blood_type = camelCaseConvert(blood_type);
  jikoshoukai = jikoshoukai[0].toUpperCase() + jikoshoukai.slice(1);
  body_height = parseInt(body_height);
  generation = parseInt(generation);
  birth_date = moment(birth_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
  joined_at = moment(joined_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
  social_media =
    typeof social_media === 'object'
      ? JSON.stringify(social_media)
      : social_media;
  const horoscopes = getZodiac(birth_date);

  if (reqFiles !== undefined) {
    const imageName = moment().unix() + '.png';
    reqFiles.mv('./public/images/' + imageName);
    unlink(`./public/images/${image_profile}`, (err) => {
      if (err) throw new ResponseError(500, err);
    });
    image_profile = imageName;
  }

  const statementUpdateMember =
    'UPDATE `member` SET name = ?, username = ?, generation = ?, birth_date = ?, blood_type = ?, jikoshoukai = ?, body_height = ?, is_active = ?, image_profile = ?, social_media = ?, joined_at = ?, horoscopes = ? WHERE member_id = ?';

  const result = await query(statementUpdateMember, [
    name,
    username,
    generation,
    birth_date,
    blood_type,
    jikoshoukai,
    body_height,
    is_active,
    image_profile,
    social_media,
    joined_at,
    horoscopes,
    memberId,
  ]);

  const objDataMember = {
    member_id: memberId,
    name: name,
    username: username,
    body_height: body_height,
    generation: generation,
    horoscopes: horoscopes,
    birth_date: moment(birth_date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
    blood_type: blood_type,
    jikoshoukai: jikoshoukai,
    image_profile: `${DOMAIN}:${PORT}/images/${image_profile}`,
    social_media: JSON.parse(social_media),
    is_active: is_active,
    joined_at: moment(joined_at, 'YYYY-MM-DD').format('DD-MM-YYYY'),
  };

  return objDataMember;
};

const deleteMember = async (memberId) => {
  if (memberId === undefined) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  const statementMember = `SELECT image_profile FROM member WHERE is_active = 1 AND member_id = ?`;
  const resultCheck = await query(statementMember, [memberId]);

  if (resultCheck === undefined || resultCheck.length == 0) {
    throw new ResponseError(400, 'Member tidak ditemukan');
  }

  let { image_profile } = resultCheck[0];

  const stateDeleteMember = 'DELETE FROM `member` WHERE member_id = ?';

  unlink(`./public/images/${image_profile}`, (err) => {
    if (err) throw new ResponseError(500, err);
  });

  const result = await query(stateDeleteMember, [memberId]);

  return result;
};

export default {
  createMember,
  getMembers,
  getSingleMember,
  updateMember,
  deleteMember,
};
