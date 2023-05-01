---
author: Rizky Mubarok
pubDatetime: 2023-04-28T15:22:00Z
title: Scraping and ingest the data to postgreSQL with Python
postSlug: scraping-and-ingest-data-postgresql
featured: true
draft: true
tags:
  - Data engineering
  - Python
  - PostgreSQL
  - Docker
  - BeautifulSoup4
description: Practicing data ingestion with scraping papers data from https://jtiulm.ti.ft.ulm.ac.id/index.php/jtiulm/issue/archive and load the data to PostgresSQL with python
---

> In this post i will explain how i manage this project end to end from scraping and load the data to PostgreSQL. or you can check the code repository for this blog post. [Github Repository](https://github.com/gitbarok/Ingest-JTIULM-paper-details-to-PostgreSQL). And I assume that you are familiar with python and basic SQL query :)

## Table of contents

## Background

Projek ini sebenarnya adalah projek pengembangan dari skrip yang telah saya buat sebelumnya, yang anda dapat lihat pada [Scraping Jurnal-Klik Github Repository](https://github.com/gitbarok/scraping-jurnalklik). pada projek tersebut, menggunakan python dan library `BeautifulSoup4` untuk alat scraping data, namun data yang selesai discraping akan diexport dalam format csv. pada projek ini data yang berhasil discarping akan diload kedalam database postgresSQL.

## What tools to use?

Here is the list of the tools for this project:

| Tools            | Description                                        | Notes                                                               |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| **_Python_**     | Proggraming languange that we use in this project. | required<sup>\*</sup>                                               |
| **_PostgreSQL_** | For database to store the data.                    | required<sup>\*</sup>                                               |
| **_Docker_**     | To running PostgresSQL as Container.               | optional<sup>\*</sup>                                               |
| **_DBeaver_**    | Database Administration Tool.                      | optional<sup>\*</sup> or you can use another DB Administration tool |

Only `Python` and `PostgreSQL` is a must to install locally in your machine.
But for this post i used docker to running my `postgreSQL` as a container.

## Let's Code!

###

### Sample Frontmatter

Here is the sample frontmatter for a post.

```yaml
# src/contents/sample-post.md
---
title: The title of the post
author: your name
pubDatetime: 2022-09-21T05:17:19Z
postSlug: the-title-of-the-post
featured: true
draft: false
tags:
  - some
  - example
  - tags
ogImage: ""
description: This is the example description of the example post.
---
```

## Adding table of contents

By default, a post (article) does not include any table of contents (toc). To include toc, you have to specify it in a specific way.

Write `Table of contents` in h2 format (## in markdown) and place it where you want it to be appeared on the post.

For instance, if you want to place your table of contents just under the intro paragraph (like I usually do), you can do that in the following way.

```md
---
# some frontmatter
---

Here are some recommendations, tips & ticks for creating new posts in AstroPaper blog theme.

## Table of contents

<!-- the rest of the post -->
```

## Headings

There's one thing to note about headings. The AstroPaper blog posts use title (title in the frontmatter) as the main heading of the post. Therefore, the rest of the heading in the post should be using h2 \~ h6.

This rule is not mandatory, but highly recommended for visual, accessibility and SEO purposes.

## Bonus

### Image compression

When you put images in the blog post, it is recommended that the image is compressed. This will affect the overall performance of the website.

My recommendation for image compression sites.

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)

### OG Image

The default OG image will be placed if a post does not specify the OG image. Though not required, OG image related to the post should be specify in the frontmatter. The recommended size for OG image is **_1200 X 640_** px.

> Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out [the announcement](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/).
