import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/redwebs.db';

const resolvedPath = path.resolve(process.cwd(), DATABASE_PATH);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

export const db = new Database(resolvedPath);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id            TEXT PRIMARY KEY,
    slug          TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    color         TEXT NOT NULL,
    accentColor   TEXT,
    iconName      TEXT,
    featured      INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS articles (
    id                  TEXT PRIMARY KEY,
    slug                TEXT NOT NULL UNIQUE,
    title               TEXT NOT NULL,
    content             TEXT NOT NULL,
    excerpt             TEXT NOT NULL,
    coverImage          TEXT NOT NULL,
    coverImageAlt       TEXT,
    author              TEXT NOT NULL,
    categoryId          TEXT NOT NULL REFERENCES categories(id),
    tags                TEXT NOT NULL DEFAULT '[]',
    readingTimeMinutes  INTEGER NOT NULL DEFAULT 5,
    publishDate         TEXT NOT NULL,
    updatedAt           TEXT NOT NULL,
    status              TEXT NOT NULL CHECK (status IN ('published','draft','archived')),
    viewsCount          INTEGER NOT NULL DEFAULT 0,
    likesCount          INTEGER NOT NULL DEFAULT 0,
    featured            INTEGER NOT NULL DEFAULT 0,
    contentType         TEXT,
    difficulty          TEXT,
    prerequisites       TEXT DEFAULT '[]',
    tutorialSteps       TEXT DEFAULT '[]',
    seo                 TEXT NOT NULL,
    wpLevel             TEXT,
    wpPlugin            TEXT,
    wpVersion           TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(categoryId);
  CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

  CREATE TABLE IF NOT EXISTS comments (
    id            TEXT PRIMARY KEY,
    postId        TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    authorName    TEXT NOT NULL,
    authorEmail   TEXT NOT NULL,
    authorAvatar  TEXT,
    content       TEXT NOT NULL,
    createdAt     TEXT NOT NULL,
    status        TEXT NOT NULL CHECK (status IN ('approved','pending','spam','rejected')),
    likes         INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(postId);

  CREATE TABLE IF NOT EXISTS comment_replies (
    id            TEXT PRIMARY KEY,
    commentId     TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    authorName    TEXT NOT NULL,
    authorRole    TEXT,
    authorAvatar  TEXT,
    content       TEXT NOT NULL,
    createdAt     TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_replies_comment ON comment_replies(commentId);

  CREATE TABLE IF NOT EXISTS settings (
    id                     INTEGER PRIMARY KEY CHECK (id = 1),
    siteTitle              TEXT NOT NULL,
    siteTagline            TEXT NOT NULL,
    siteDescription        TEXT NOT NULL,
    siteUrl                TEXT NOT NULL,
    authorName             TEXT NOT NULL,
    authorRole             TEXT NOT NULL,
    authorBio              TEXT NOT NULL,
    authorAvatar           TEXT NOT NULL,
    defaultOgImage         TEXT NOT NULL,
    enableComments         INTEGER NOT NULL DEFAULT 1,
    autoApproveComments    INTEGER NOT NULL DEFAULT 0,
    postsPerPage           INTEGER NOT NULL DEFAULT 9,
    headerLogoText         TEXT NOT NULL,
    footerText             TEXT NOT NULL,
    contactEmail           TEXT NOT NULL,
    telegramUsername       TEXT,
    githubUrl              TEXT,
    twitterUrl             TEXT,
    instagramUrl           TEXT,
    youtubeUrl             TEXT,
    googleSiteVerification TEXT
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            TEXT PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE,
    passwordHash  TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','author')),
    createdAt     TEXT NOT NULL
  );
`);

// --- Migrations for installs created before multi-user support existed ---

// admin_users used to be capped at a single row (id INTEGER CHECK (id = 1)).
// Detect the old shape and rebuild the table with a real primary key + role.
const adminUsersInfo = db.prepare('PRAGMA table_info(admin_users)').all() as { name: string }[];
if (!adminUsersInfo.some((col) => col.name === 'role')) {
  const legacyRows = db.prepare('SELECT username, passwordHash, createdAt FROM admin_users').all() as {
    username: string;
    passwordHash: string;
    createdAt: string;
  }[];

  db.exec('ALTER TABLE admin_users RENAME TO admin_users_legacy');
  db.exec(`
    CREATE TABLE admin_users (
      id            TEXT PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      passwordHash  TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','author')),
      createdAt     TEXT NOT NULL
    );
  `);

  const insertLegacyUser = db.prepare(
    'INSERT INTO admin_users (id, username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
  );
  for (const row of legacyRows) {
    insertLegacyUser.run(crypto.randomUUID(), row.username, row.passwordHash, 'admin', row.createdAt);
  }
  db.exec('DROP TABLE admin_users_legacy');
}

const articlesInfo = db.prepare('PRAGMA table_info(articles)').all() as { name: string }[];
if (!articlesInfo.some((col) => col.name === 'ownerUserId')) {
  db.exec('ALTER TABLE articles ADD COLUMN ownerUserId TEXT REFERENCES admin_users(id)');
}
