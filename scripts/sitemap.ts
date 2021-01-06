import fs from 'fs'
import path from 'path'
// @ts-ignore
import sitemap from 'nextjs-sitemap-generator'
import site from '../site.config.json'

const nextDir = path.join(__dirname, '../.next')

const BUILD_ID = fs.readFileSync(path.join(nextDir, '/BUILD_ID')).toString()

sitemap({
  baseUrl: site.host,
  pagesDirectory: path.join(nextDir, '/serverless/pages'),
  targetDirectory: './public',
  ignoredExtensions: ['js', 'map'],
  extraPaths: ['/'],
  ignoredPaths: ['[fallback]', '/404', '/index'],
})
