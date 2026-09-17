# Graph Report - E:\mobarok-portfolio  (2026-09-11)

## Corpus Check
- 99 files · ~260,087 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 285 nodes · 416 edges · 52 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 41 edges
2. `POST()` - 34 edges
3. `PUT()` - 25 edges
4. `generateMetadata()` - 20 edges
5. `DELETE()` - 18 edges
6. `PATCH()` - 9 edges
7. `ServicePage()` - 8 edges
8. `normalizeImageRefs()` - 8 edges
9. `Home()` - 7 edges
10. `getCanonicalUrl()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getPageMeta()`  [INFERRED]
  E:\mobarok-portfolio\app\wordpress-web-design-bangladesh\page.js → E:\mobarok-portfolio\lib\pageMeta.js
- `generateMetadata()` --calls--> `toMetadata()`  [INFERRED]
  E:\mobarok-portfolio\app\wordpress-web-design-bangladesh\page.js → E:\mobarok-portfolio\lib\pageMeta.js
- `generateMetadata()` --calls--> `getCanonicalUrl()`  [INFERRED]
  E:\mobarok-portfolio\app\wordpress-web-design-bangladesh\page.js → E:\mobarok-portfolio\lib\pageMeta.js
- `getYouTubeEmbedUrl()` --calls--> `GET()`  [INFERRED]
  E:\mobarok-portfolio\app\admin\site-settings\page.js → E:\mobarok-portfolio\app\sitemap.xml\route.js
- `prepareProjectForm()` --calls--> `normalizeImageRefs()`  [INFERRED]
  E:\mobarok-portfolio\app\admin\projects\page.js → E:\mobarok-portfolio\lib\validators.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (26): requireAdmin(), getPageHtml(), isValidPageSlug(), blogSaveError(), checkRateLimit(), cleanCertificate(), cleanMeta(), cleanReview() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (8): BlogPostPage(), generateMetadata(), getBlog(), getImages(), getMember(), getProject(), ProjectCaseStudyPage(), TeamMemberPage()

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (16): generateMetadata(), RootLayout(), CaseStudiesPage(), WebDesignServicesBangladeshPage(), cleanGtmId(), getCanonicalUrl(), getPageMeta(), getSeoIntegrations() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (10): getImage(), getCertificates(), getCmsService(), getProjects(), getSetting(), mergeServiceConfig(), ProjectCard(), ServicePage() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (12): blogSlugExists(), createDbClient(), deleteRowById(), fetchSingleRow(), insertSingleRow(), loadEnvFile(), parseEnvLine(), slugify() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (12): ContentBlock(), GalleryField(), ProjectManagement(), validateIfPublished(), getProjectImages(), isMissingText(), normalizeImageRefs(), pushImageAltMissing() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (5): AboutPage(), getAboutSettings(), getYouTubeEmbedUrl(), SiteSettingsPage(), Toast()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (8): adminFetch(), getFileTooLargeMessage(), getMaxUploadBytes(), getMaxUploadMb(), getStorageBucket(), getUploadErrorMessage(), parseJsonSafe(), uploadDirectToStorage()

### Community 8 - "Community 8"
Cohesion: 0.46
Nodes (7): getProjects(), getReviews(), getServices(), getSettings(), getSkills(), getStats(), Home()

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (5): absoluteUrl(), getDynamicUrls(), getRobotsText(), getSetting(), getSitemapXml()

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (7): About Page, Blog Page, Graphic Design Service, Home Page (index.html), Meta Ads Management, UI/UX Design Service, WordPress CMS Development

### Community 11 - "Community 11"
Cohesion: 0.6
Nodes (5): cleanReachableImageSrc(), cleanReachableSocialUrl(), cleanSocialUrl(), isReachableHttpUrl(), localPublicImageExists()

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (2): BlogPage(), getBlogs()

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (2): Footer(), getSocialLinks()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **6 isolated node(s):** `About Page`, `Graphic Design Service`, `UI/UX Design Service`, `Meta Ads Management`, `WordPress CMS Development` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 18`** (2 nodes): `Providers.js`, `AuthProvider()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `page.js`, `AdminDashboard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `page.js`, `BlogManagement()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `page.js`, `ContactsAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `page.js`, `PagesAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `page.js`, `ProductsAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `page.js`, `SiteStatsAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `page.js`, `SkillsAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `page.js`, `SocialAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `page.js`, `TeamAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `page.js`, `UsersAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `ContactForm()`, `ContactForm.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `JsonLdScript.js`, `JsonLdScript()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `MobileCarousel.js`, `MobileCarousel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `Navbar.js`, `Navbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `RichTextEditor.js`, `RichTextEditor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `MediaPicker.js`, `MediaPicker()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `page.js`, `GraphicDesignPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `page.js`, `Login()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `page.js`, `MetaAdsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `page.js`, `WordPressDevPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `supabase.js`, `getSupabaseAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `main()`, `add-service-column.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `servicePageConfigs.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `cmsFallbacks.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `supabaseClient.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `fix-jsx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `migrate.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `README.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `AGENTS.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `CLAUDE.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Community 0` to `Community 9`, `Community 2`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `generateMetadata()` connect `Community 1` to `Community 8`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `getCanonicalUrl()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `GET()` (e.g. with `POST()` and `getYouTubeEmbedUrl()`) actually correct?**
  _`GET()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `POST()` (e.g. with `GET()` and `requireAdmin()`) actually correct?**
  _`POST()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `PUT()` (e.g. with `requireAdmin()` and `isValidPageSlug()`) actually correct?**
  _`PUT()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `generateMetadata()` (e.g. with `toMetadata()` and `getPageMeta()`) actually correct?**
  _`generateMetadata()` has 3 INFERRED edges - model-reasoned connections that need verification._