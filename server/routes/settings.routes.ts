import { Router } from 'express';
import { db } from '../db';
import { settingsFromRow } from '../mappers';
import { requireAuth } from '../auth';
import { SiteSettings } from '../../src/types';

export const settingsRouter = Router();

settingsRouter.get('/', (_req, res) => {
  const row = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (!row) return res.status(404).json({ error: 'تنظیمات یافت نشد' });
  res.json(settingsFromRow(row));
});

settingsRouter.put('/', requireAuth, (req, res) => {
  const s = req.body as SiteSettings;
  db.prepare(`
    UPDATE settings SET
      siteTitle=@siteTitle, siteTagline=@siteTagline, siteDescription=@siteDescription, siteUrl=@siteUrl,
      authorName=@authorName, authorRole=@authorRole, authorBio=@authorBio, authorAvatar=@authorAvatar,
      defaultOgImage=@defaultOgImage, enableComments=@enableComments, autoApproveComments=@autoApproveComments,
      postsPerPage=@postsPerPage, headerLogoText=@headerLogoText, footerText=@footerText, contactEmail=@contactEmail,
      telegramUsername=@telegramUsername, githubUrl=@githubUrl, twitterUrl=@twitterUrl,
      instagramUrl=@instagramUrl, youtubeUrl=@youtubeUrl, googleSiteVerification=@googleSiteVerification
    WHERE id = 1
  `).run({
    siteTitle: s.siteTitle,
    siteTagline: s.siteTagline,
    siteDescription: s.siteDescription,
    siteUrl: s.siteUrl,
    authorName: s.authorName,
    authorRole: s.authorRole,
    authorBio: s.authorBio,
    authorAvatar: s.authorAvatar,
    defaultOgImage: s.defaultOgImage,
    enableComments: s.enableComments ? 1 : 0,
    autoApproveComments: s.autoApproveComments ? 1 : 0,
    postsPerPage: s.postsPerPage,
    headerLogoText: s.headerLogoText,
    footerText: s.footerText,
    contactEmail: s.contactEmail,
    telegramUsername: s.telegramUsername || null,
    githubUrl: s.githubUrl || null,
    twitterUrl: s.twitterUrl || null,
    instagramUrl: s.instagramUrl || null,
    youtubeUrl: s.youtubeUrl || null,
    googleSiteVerification: s.googleSiteVerification || null,
  });

  const row = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  res.json(settingsFromRow(row));
});
