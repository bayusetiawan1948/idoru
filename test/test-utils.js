import { query } from '../src/app/database.js';
import fs from 'fs';
const chooseMember = (memberName) => {
  const member = {};
  switch (memberName) {
    case 'chika':
      member.member_id = 'U-09090909';
      member.name = 'Yessica Tamara';
      member.username = 'Chika';
      member.generation = 7;
      member.birth_date = '2002-09-24';
      member.blood_type = 'A';
      member.horoscopes = 'Libra';
      member.jikoshoukai =
        'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika';
      member.body_height = 165;
      member.image_profile = '99887766.png';
      member.old_image_profile = 'yessica_tamara.png';
      member.is_active = 1;
      member.social_media =
        '{\r\n      "instagram": "https://www.instagram.com/jkt48.chika/",\r\n      "twitter": "https://twitter.com/Y_ChikaJKT48",\r\n      "tiktok": "https://www.tiktok.com/@chikajkt48",\r\n      "showroom": "https://www.showroom-live.com/r/JKT48_Chika"\r\n  }';
      member.joined_at = '2018-09-29';
      member.created_at = '2023-08-08 09:54:36';
      break;

    case 'oniel':
      member.member_id = 'U-09090909';
      member.name = 'Cornelia Vanisa';
      member.username = 'Oniel';
      member.generation = 8;
      member.birth_date = '26-07-2002';
      member.blood_type = 'A';
      member.horoscopes = 'Leo';
      member.jikoshoukai =
        'Seperti teka teki kalian akan selalu penasaran denganku, halo aku Oniel';
      member.body_height = 165;
      member.image_profile = '11223344.png';
      member.old_image_profile = 'cornelia_vanisa.png';
      member.is_active = 1;
      member.social_media =
        '{\r\n          "instagram": "https://www.instagram.com/jkt48.oniel/",\r\n          "twitter": "https://twitter.com/C_OnielJKT48",\r\n          "tiktok": "https://www.tiktok.com/@onieljkt48",\r\n          "showroom": "https://www.showroom-live.com/r/JKT48_Oniel"\r\n        }';
      member.joined_at = '27-04-2019';
      member.created_at = '2023-08-08 09:54:36';
      break;

    default:
      member.member_id = 'U-09090909';
      member.name = 'Yessica Tamara';
      member.username = 'Chika';
      member.generation = 7;
      member.birth_date = '2002-09-24';
      member.blood_type = 'A';
      member.horoscopes = 'Libra';
      member.jikoshoukai =
        'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika';
      member.body_height = 165;
      member.image_profile = '99887766.png';
      member.old_image_profile = 'yessica_tamara.png';
      member.is_active = 1;
      member.social_media =
        '{\r\n      "instagram": "https://www.instagram.com/jkt48.chika/",\r\n      "twitter": "https://twitter.com/Y_ChikaJKT48",\r\n      "tiktok": "https://www.tiktok.com/@chikajkt48",\r\n      "showroom": "https://www.showroom-live.com/r/JKT48_Chika"\r\n  }';
      member.joined_at = '2018-09-29';
      member.created_at = '2023-08-08 09:54:36';
      break;
  }
  return member;
};

const removeTestMember = async () => {
  const statement = 'DELETE FROM `member`';
  await query(statement);
  // removeFolder('../public/images');
};

const addFile = (file, newName) => {
  const savePath = './public/images/' + newName;
  const filePath = './test/prepared/' + file;
  fs.copyFile(filePath, savePath, function (err) {
    if (err) throw err;
  });
  // console.info('ngisi file');
};

const removeFolder = (folder) => {
  const path = folder;
  fs.rm(path, { recursive: true }, (err) => {
    if (err) throw err;
    console.info('ngapus folder', err);
    fs.mkdir(folder, (err) => {
      if (err) throw err;
      console.info('buat folder');
      addFile('jeketi-default-red.png', 'jeketi-default-red.png');
      console.info('buat file');
    });
  });
};

const createTestMember = async (member) => {
  const dataMember = chooseMember(member);
  const statement =
    'INSERT INTO `member`(`member_id`, `name`, `username`, `generation`, `birth_date`, `blood_type`, `horoscopes`, `jikoshoukai`, `body_height`, `image_profile`, `is_active`, `social_media`, `joined_at`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const data = [
    dataMember.member_id,
    dataMember.name,
    dataMember.username,
    dataMember.generation,
    dataMember.birth_date,
    dataMember.blood_type,
    dataMember.horoscopes,
    dataMember.jikoshoukai,
    dataMember.body_height,
    dataMember.image_profile,
    dataMember.is_active,
    dataMember.social_media,
    dataMember.joined_at,
    dataMember.created_at,
  ];
  await query(statement, data);
  // addFile(dataMember.old_image_profile, dataMember.image_profile);
};

export { removeTestMember, createTestMember, addFile };
