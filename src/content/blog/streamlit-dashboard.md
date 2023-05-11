---
author: Rizky Mubarok
pubDatetime: 2023-05-07T10:44:52.737Z
title: Data Visualization with Streamlit and Tableau
postSlug: data-visualization-streamlit-tableau
featured: true
draft: true
tags:
  - Data Visualization
  - Python
  - Streamlit
  - Tableau
description: Data visualization is a powerful tool that allows us to explore and understand complex data sets in a more intuitive way. In this blog post, we'll dive into the minimum wage in DI Yogyakarta and demonstrate how to create visualizations using two popular tools, Streamlit and Tableau.
---

> So, in this post, I'm gonna break down how I manage this project from start to finish - that includes data preparation and data visualization. If you're curious about the code, you can check out the Github repository right over here: [Github Repository](https://github.com/gitbarok/Data-Preparation-and-VIsualization-UMP-Kabupaten-Provinsi-DI-Yogyakarta). But just a heads up - I'm assuming for this project you've got some basic knowledge of Python.

## Table of contents

## Background

This project is actually just for practice. I'm trying out the Streamlit library for the first time as a data visualization tool. Normally, I use Tableau or Looker Studio for this kind of thing, but I figured I'd mix it up a bit and try something new :?, so yeah, check it out!

## What tools to use?

Here is the list of the tools for this project:

| Tools         | Description                                        | Notes                 |
| ------------- | -------------------------------------------------- | --------------------- |
| **_Python_**  | Proggraming languange that we use in this project. | required<sup>\*</sup> |
| **_Tableau_** | Data Visualization Tools.                          | optional<sup>\*</sup> |

To begin with this project, you just need to have Python installed and then install the library that is related to this project. The first step is to clone the Github repository in the link above, and once that's done, navigate to the repository folder and type the command `pip install -r requirements.txt` in your terminal. This will install all the necessary dependencies for this project.

## Let's Code!

### Data Cleansing

Here is the `docker-compose.yaml` file for this project and make sure you already had docker in your local machine to run the yaml file, you can skipped this part if you are planning to installing PostgreSQL without docker, you can refer to [this link](https://www.postgresql.org/download/) to install PostgreSQL in your machine.

```yaml
# docker-compose.yaml
---
version: "3.9"

services:
  postgres:
    container_name: postgres_db
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=root
      - POSTGRES_DB=jtiulm
    ports:
      - "5432:5432"
    volumes:
      - data:/var/lib/postgresql/data

volumes:
  data:
---
```

### Initiate the library

```python
# script.py
import pandas as pd
import psycopg2
import requests
import logging

from bs4 import BeautifulSoup

```
