import supertest from 'supertest';
import { removeTestMember, createTestMember, addFile } from './test-utils.js';
import { app } from '../src/app/server.js';

describe('POST /api/members', () => {
  const filePath = `${__dirname}/prepared/yessica_tamara.png`;
  afterEach(async () => {
    await removeTestMember();
  });

  it('should can add new member', async () => {
    const result = await supertest(app)
      .post('/api/members')
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'Yessica Tamara')
      .field('username', 'Chika')
      .field(
        'jikoshoukai',
        'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika'
      )
      .field('birth_date', '24-09-2002')
      .field('body_height', 165)
      .field('blood_type', 'A')
      .field('generation', 7)
      .field('joined_at', '29-09-2018')
      .field('isActive', 1)
      .field(
        'social_media',
        JSON.stringify({
          instagram: 'https://www.instagram.com/jkt48.chika/',
          twitter: 'https://twitter.com/Y_ChikaJKT48',
          tiktok: 'https://www.tiktok.com/@chikajkt48',
          showroom: 'https://www.showroom-live.com/r/JKT48_Chika',
        })
      )
      .attach('file', filePath);
    expect(result.status).toBe(200);
  });

  it('should cannot add new member', async () => {
    const result = await supertest(app)
      .post('/api/members')
      .set('Content-Type', 'multipart/form-data')
      .field('name', '')
      .field('username', '')
      .field('jikoshoukai', '')
      .field('birth_date', '24-09-2002')
      .field('body_height', 165)
      .field('blood_type', 'A')
      .field('generation', 7)
      .field('joined_at', '29-09-2018')
      .field('isActive', 1)
      .field(
        'social_media',
        JSON.stringify({
          instagram: '',
          twitter: '',
          tiktok: 'https://www.tiktok.com/@chikajkt48',
          showroom: '',
        })
      )
      .attach('file', filePath);
    expect(result.status).toBe(400);
  });
});

describe('GET /api/members', () => {
  afterEach(async () => {
    await removeTestMember();
  });

  it('should show members', async () => {
    await createTestMember('chika');
    const result = await supertest(app).get('/api/members');
    expect(result.status).toBe(200);
    expect(result.body.data).toEqual([
      {
        member_id: 'U-09090909',
        nama: 'Yessica Tamara',
        username: 'Chika',
        body_height: 165,
        generation: 7,
        horoscopes: 'Libra',
        birth_date: '24-09-2002',
        blood_type: 'A',
        jikoshoukai:
          'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika',
        image_profile: '127.0.0.1:5000/images/99887766.png',
        social_media: {
          instagram: 'https://www.instagram.com/jkt48.chika/',
          twitter: 'https://twitter.com/Y_ChikaJKT48',
          tiktok: 'https://www.tiktok.com/@chikajkt48',
          showroom: 'https://www.showroom-live.com/r/JKT48_Chika',
        },
        joined_at: '29-09-2018',
      },
    ]);
  });

  it('should show empty members', async () => {
    const result = await supertest(app).get('/api/members');
    expect(result.status).toBe(200);
    expect(result.body.data).toEqual([]);
  });
});

describe('GET /api/members/:id', () => {
  afterEach(async () => {
    await removeTestMember();
  });

  it('should show members', async () => {
    await createTestMember('chika');
    const result = await supertest(app).get('/api/members/U-09090909');
    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      member_id: 'U-09090909',
      nama: 'Yessica Tamara',
      username: 'Chika',
      body_height: 165,
      generation: 7,
      horoscopes: 'Libra',
      birth_date: '24-09-2002',
      blood_type: 'A',
      jikoshoukai:
        'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika',
      image_profile: '127.0.0.1:5000/images/99887766.png',
      social_media: {
        instagram: 'https://www.instagram.com/jkt48.chika/',
        twitter: 'https://twitter.com/Y_ChikaJKT48',
        tiktok: 'https://www.tiktok.com/@chikajkt48',
        showroom: 'https://www.showroom-live.com/r/JKT48_Chika',
      },
      joined_at: '29-09-2018',
    });
  });

  it('should not show members', async () => {
    const result = await supertest(app).get('/api/members/U-09090909');
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe('Member tidak ditemukan');
  });
});

describe('PUT /api/members/:memId', () => {
  afterEach(async () => {
    await removeTestMember();
  });

  it('should update member with empty field', async () => {
    await createTestMember('chika');
    const result = await supertest(app)
      .put('/api/members/U-09090909')
      .send({
        name: 'Yessica Tamara',
        username: '',
        jikoshoukai:
          'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika',
        birth_date: '24-09-2002',
        body_height: 165,
        blood_type: 'A',
        generation: 7,
        joined_at: '29-09-2018',
        isActive: 1,
        social_media: {
          instagram: 'https://www.instagram.com/jkt48.chika/',
          twitter: 'https://twitter.com/Y_ChikaJKT48',
        },
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      member_id: 'U-09090909',
      name: 'Yessica Tamara',
      username: 'Chika',
      body_height: 165,
      generation: 7,
      horoscopes: 'Libra',
      birth_date: '24-09-2002',
      blood_type: 'A',
      jikoshoukai:
        'Dengan gummy smile ku, aku akan memberikan kebahagian hallo aku chika',
      image_profile: '127.0.0.1:5000/images/99887766.png',
      social_media: {
        instagram: 'https://www.instagram.com/jkt48.chika/',
        twitter: 'https://twitter.com/Y_ChikaJKT48',
        tiktok: '',
        showroom: '',
      },
      joined_at: '29-09-2018',
      is_active: 1,
    });
  });

  it('should update member with fullified field', async () => {
    await createTestMember('chika');
    const filePath = `${__dirname}/prepared/cornelia_vanisa.png`;
    const result = await supertest(app)
      .put('/api/members/U-09090909')
      .send({
        name: 'Cornelia Vanisa',
        username: 'Oniel',
        jikoshoukai:
          'Seperti teka teki kalian akan selalu penasaran denganku, halo aku Oniel',
        birth_date: '26-07-2002',
        body_height: 162,
        blood_type: 'A',
        generation: 8,
        joined_at: '27-04-2019',
        isActive: 1,
        social_media: {
          instagram: 'https://www.instagram.com/jkt48.oniel/',
          twitter: 'https://twitter.com/C_OnielJKT48',
          tiktok: 'https://www.tiktok.com/@onieljkt48',
          showroom: 'https://www.showroom-live.com/r/JKT48_Oniel',
        },
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      member_id: 'U-09090909',
      name: 'Cornelia Vanisa',
      username: 'Oniel',
      body_height: 162,
      generation: 8,
      horoscopes: 'Leo',
      birth_date: '26-07-2002',
      blood_type: 'A',
      jikoshoukai:
        'Seperti teka teki kalian akan selalu penasaran denganku, halo aku Oniel',
      image_profile: '127.0.0.1:5000/images/99887766.png',
      social_media: {
        instagram: 'https://www.instagram.com/jkt48.oniel/',
        twitter: 'https://twitter.com/C_OnielJKT48',
        tiktok: 'https://www.tiktok.com/@onieljkt48',
        showroom: 'https://www.showroom-live.com/r/JKT48_Oniel',
      },
      joined_at: '27-04-2019',
      is_active: 1,
    });
  });

  it('should not update member', async () => {
    const result = await supertest(app).put('/api/members/U-09090909');
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe('Member tidak ditemukan');
  });
});

describe('DELETE /api/members/:memId', () => {
  afterEach(async () => {
    await removeTestMember();
  });

  it('should delete member', async () => {
    await createTestMember('oniel');
    addFile('./cornelia_vanisa.png', '11223344.png');
    const result = await supertest(app).delete('/api/members/U-09090909');
    expect(result.status).toBe(200);
  });

  it('should not delete member', async () => {
    const result = await supertest(app).delete('/api/members/U-09090909');
    expect(result.status).toBe(400);
    expect(result.body.errors).toBe('Member tidak ditemukan');
  });
});
