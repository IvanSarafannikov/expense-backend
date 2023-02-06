import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Prisma from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import * as request from 'supertest';

import { AppModule } from '@Src/app.module';
import { clearDatabase } from '@Test/utils/clear-database';
import getCookies from '@Test/utils/get-cookies';
import { sleep } from '@Test/utils/sleep';

describe('AppController (e2e)', () => {
  let app: Application;
  let application: INestApplication;

  beforeAll(async () => {
    // Init express application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = await module
      .createNestApplication()
      .use(cookieParser())
      .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
      .init();

    app = application.getHttpServer();

    await clearDatabase();
  });

  afterAll(async () => {
    await application.close();
    await clearDatabase();
  });

  describe('Entire auth logic cycle', () => {
    const user = {
      email: 'some@email.com',
      username: 'guess',
      password: '123123123',
      accessToken: '',
      refreshToken: '',
    };

    let userFromDb: Prisma.User;

    it('register user', async () => {
      expect(await prisma.user.count()).toBe(0);
      await request(app).post('/auth/register').send(user).expect(201);

      expect(await prisma.user.count()).toBe(1);

      userFromDb = await prisma.user.findFirst({
        where: { email: user.email },
      });

      expect(userFromDb.username).toBe(user.username);
    });

    it('log-in user', async () => {
      expect(await prisma.session.count()).toBe(0);

      const r = await request(app).get('/auth/login').send(user).expect(200);

      const cookies = getCookies(r);

      expect(r.body.accessToken).toBeDefined();
      expect(cookies.refreshToken.value).toBeDefined();

      const sessions = await prisma.session.findMany();

      expect(sessions).toHaveLength(1);

      expect(sessions[0].refreshToken).not.toBe(user.refreshToken);

      user.refreshToken = cookies.refreshToken.value;
      user.accessToken = r.body.accessToken;
    });

    it('refresh token', async () => {
      await sleep(1000);
      const r = await request(app)
        .get('/auth/refresh')
        .set('Cookie', [`refreshToken=${user.refreshToken}`])
        .expect(200);

      const cookies = getCookies(r);

      expect(r.body.accessToken).toBeDefined();
      expect(cookies.refreshToken.value).toBeDefined();

      expect(cookies.refreshToken.value).not.toBe(user.refreshToken);

      user.refreshToken = cookies.refreshToken.value;

      expect((await prisma.session.findMany())[0].refreshToken).toBe(
        cookies.refreshToken.value,
      );
    });

    it('log-out user', async () => {
      await request(app)
        .get('/auth/logout')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      expect(await prisma.session.count()).toBe(0);
    });

    it('get sessions', async () => {
      const r = await request(app).get('/auth/login').send(user).expect(200);
      const cookies = getCookies(r);
      user.refreshToken = cookies.refreshToken.value;
      user.accessToken = r.body.accessToken;

      const { body } = await request(app)
        .get('/auth/session')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      expect(body).toHaveLength(1);
    });

    it('delete session', async () => {
      const { body: sessions } = await request(app)
        .get('/auth/session')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      await request(app)
        .delete('/auth/session/' + sessions[0].id)
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      expect(await prisma.session.findMany()).toHaveLength(sessions.length - 1);
    });

    it('rename session', async () => {
      const r = await request(app).get('/auth/login').send(user).expect(200);
      const cookies = getCookies(r);
      user.refreshToken = cookies.refreshToken.value;
      user.accessToken = r.body.accessToken;

      const { body: sessions } = await request(app)
        .get('/auth/session')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      const { body: updatedSession } = await request(app)
        .patch('/auth/session/' + sessions[0].id)
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .send({
          deviceName: 'MacBook Pro',
        })
        .expect(200);

      const sessionFromDb = await prisma.session.findFirst({
        where: {
          id: sessions[0].id,
        },
      });

      expect(sessionFromDb.deviceName).toBe('MacBook Pro');
      expect(updatedSession.deviceName).toBe('MacBook Pro');
    });

    it('change user password', async () => {
      // Create other session to check if they will be deleted after password change
      await request(app).get('/auth/login').send(user).expect(200);
      await request(app).get('/auth/login').send(user).expect(200);
      await request(app).get('/auth/login').send(user).expect(200);
      await request(app).get('/auth/login').send(user).expect(200);

      const sessions = await prisma.session.findMany({
        where: {
          userId: userFromDb.id,
        },
      });

      expect(sessions).toHaveLength(5);

      await request(app)
        .patch('/auth/change-password')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .send({
          oldPassword: user.password,
          newPassword: 'main123123',
        })
        .expect(200);

      user.password = 'main123123';

      const sessionsAfter = await prisma.session.findMany();

      expect(sessionsAfter).toHaveLength(0);

      const userWithNewPassword = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      expect(userWithNewPassword.password).not.toBe(userFromDb.password);

      userFromDb = userWithNewPassword;
    });
  });

  describe('other cases', () => {
    test('try register with already exists email', async () => {
      const { body } = await request(app)
        .post('/auth/register')
        .send({
          email: 'some@email.com',
          username: 'guess1',
          password: 'password',
        })
        .expect(400);

      expect(body.message).toBe('User with specified email already exists');
    });

    test('try register with already exists username', async () => {
      const { body } = await request(app)
        .post('/auth/register')
        .send({
          email: 'some1@email.com',
          username: 'guess',
          password: 'password',
        })
        .expect(400);

      expect(body.message).toBe('User with specified username already exists');
    });

    test('try login with bad password', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'some3@email.com',
          username: 'guess3',
          password: 'password',
        })
        .expect(201);

      const { body } = await request(app)
        .get('/auth/login')
        .send({
          email: 'some3@email.com',
          password: 'some-one',
        })
    });
  });
});
