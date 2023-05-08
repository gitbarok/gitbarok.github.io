---
author: Rizky Mubarok
pubDatetime: 2023-05-07T10:44:52.737Z
title: Scraping and ingest data to postgreSQL with Python
postSlug: scraping-and-ingest-data-postgresql
featured: true
tags:
  - Data engineering
  - Python
  - PostgreSQL
  - Docker
  - BeautifulSoup4
description: Scrape paper data from https://jtiulm.ti.ft.ulm.ac.id and load it into PostgreSQL with Python. Discover the process of data scraping, data processing with Python, and database loading. this practical project to improve my data ingestion skills!
---

> So, in this post, I'm gonna break down how I manage this project from start to finish - that includes scraping data and loading it into PostgreSQL. If you're curious about the code, you can check out the Github repository right over here: [Github Repository](https://github.com/gitbarok/Ingest-JTIULM-paper-details-to-PostgreSQL). But just a heads up - I'm assuming for this project you've got some basic knowledge of Python and SQL queries :).

## Table of contents

## Background

So this project is actually a souped-up version of a script I made earlier. Check it out at [Scraping Jurnal-Klik Github Repository](https://github.com/gitbarok/scraping-jurnalklik). In the last one, I used Python and `BeautifulSoup4` to scrape some data, but then it was only saved in CSV format. But, in this new project, I'm taking it to the next level by loading all that scraped data into a postgreSQL database.

## What tools to use?

Here is the list of the tools for this project:

| Tools            | Description                                        | Notes                                                                |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| **_Python_**     | Proggraming languange that we use in this project. | required<sup>\*</sup>                                                |
| **_PostgreSQL_** | For database to store the data.                    | required<sup>\*</sup>                                                |
| **_Docker_**     | To running PostgresSQL as Container.               | optional<sup>\*</sup>                                                |
| **_DBeaver_**    | Database Administration Tool.                      | optional<sup>\*</sup> or you can use another DB Administration tools |

To get started, you only need to install Python and PostgreSQL on your local machine. However, for the purposes sake of over-engineering :)), I used docker to run PostgreSQL.

## Let's Code!

### PostgreSQL with docker-compose (optional)

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

| Name     | Description                                     |
| -------- | ----------------------------------------------- |
| pandas   | for basic data manipulation                     |
| psycopg2 | postgreSQL adapter for Python                   |
| request  | send HTTP requests and work with HTTP responses |
| logging  | for log message                                 |
| bs4      | web scraping library                            |

### Create a python function to connect to a PostgreSQL database

```python
# script.py
def create_db():
    con = psycopg2.connect(
        database="jtiulm",
        user="user",
        password="root",
        host="0.0.0.0")

    cur = con.cursor()
    cur.execute("DROP TABLE IF EXISTS paper_details")
    cur.execute("""CREATE TABLE IF NOT EXISTS paper_details(
    title VARCHAR,
    author VARCHAR,
    link VARCHAR
    )""")
    con.commit()

    return con, cur

```

This Python code defines a function named create_db(), which connects to a PostgreSQL database named "jtiulm" using the psycopg2 library. The function then creates a cursor object cur, which is used to execute SQL commands on the connected database.

In this particular case, the function first checks if a table named "paper_details" already exists in the database and if so, drops it. Then, it creates a new table named "paper_details" with three columns: "title", "author", and "link".

After executing these commands, the function commits the changes to the database and returns the connection and cursor objects, which can be used later in the code. This function is useful for initializing the database with the necessary table(s) and structure before proceeding with data insertion or other operations.

### Create a python function to scrape the webpage

```python
# script.py
def scrape_jtiulm():
    # declare url target
    url = 'https://jtiulm.ti.ft.ulm.ac.id/index.php/jtiulm/issue/archive'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    # get all link from the archive and stored in links as a list
    links = []
    for link in soup.find_all('a', class_='cover'):
        links.append(link.get('href'))

    paper = {
        'title': [],
        'author': [],
        'link': [],
    }

    for link in links:
        page_a = requests.get(link)
        results_a = BeautifulSoup(page_a.content, 'html.parser')
        for content in results_a.find_all('div', class_='obj_article_summary'):
            paper_title = content.find('div', class_='title').text.strip()
            paper_author = content.find('div', class_='authors').text
            paper_link = content.find('a').get('href')
            paper['title'].append(paper_title)
            paper['author'].append(paper_author.replace('\t', '').replace('\n', ''))
            paper['link'].append(paper_link)


    df = pd.DataFrame.from_dict(paper)
    return df

```

This Python code defines a function named scrape_jtiulm() which scrapes data from a webpage and stores it in a pandas DataFrame. The function first declares a target URL as a string and sends a request to the webpage using the requests library.

The content of the page is then parsed using the BeautifulSoup library to extract all links from the webpage's archive, which are stored in a list called links. A dictionary called paper is also created with three empty keys: "title", "author", and "link".

The function then iterates over each link in links and sends another request to each link. The content of the resulting page is parsed using BeautifulSoup again to extract information about each paper, including the paper's title, author, and link.

### Create python function for main program

```python
# script.py
def main():
    logging.basicConfig(filename='app.log', filemode='w', format='%(asctime)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S', level=logging.INFO)
    conn, cur = create_db()
    logging.info("Scraping started")
    df = scrape_jtiulm()
    logging.info("Scraping finished")
    sql_script = ("""INSERT INTO paper_details(
    title,
    author,
    link)
    VALUES (%s, %s, %s)
    """)
    for i, data in df.iterrows():
        logging.info(f'insert {i+1} row from {df.shape[0]} total row')
        cur.execute(sql_script, list(data))
    conn.commit()

```

This code defines the main function that sets up the logging, creates a connection to the PostgreSQL database using the create_db function, and scrapes data from the jtiulm website using the scrape_jtiulm function. It then creates an SQL script to insert the data into the paper_details table in the PostgreSQL database. The function then iterates through the rows in the DataFrame containing the scraped data, executes the SQL script for each row, and logs the progress. Finally, it commits the changes to the database.

### script.py full code

```python
# script.py
import pandas as pd
import psycopg2
import requests
import logging

from bs4 import BeautifulSoup

def create_db():
    con = psycopg2.connect(
        database="jtiulm",
        user="user",
        password="root",
        host="0.0.0.0")

    cur = con.cursor()
    cur.execute("DROP TABLE IF EXISTS paper_details")
    cur.execute("""CREATE TABLE IF NOT EXISTS paper_details(
    title VARCHAR,
    author VARCHAR,
    link VARCHAR
    )""")
    con.commit()

    return con, cur

def scrape_jtiulm():
    # declare url target
    url = 'https://jtiulm.ti.ft.ulm.ac.id/index.php/jtiulm/issue/archive'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    # get all link from the archive and stored in links as a list
    links = []
    for link in soup.find_all('a', class_='cover'):
        links.append(link.get('href'))

    paper = {
        'title': [],
        'author': [],
        'link': [],
    }

    for link in links:
        page_a = requests.get(link)
        results_a = BeautifulSoup(page_a.content, 'html.parser')
        for content in results_a.find_all('div', class_='obj_article_summary'):
            paper_title = content.find('div', class_='title').text.strip()
            paper_author = content.find('div', class_='authors').text
            paper_link = content.find('a').get('href')
            paper['title'].append(paper_title)
            paper['author'].append(paper_author.replace('\t', '').replace('\n', ''))
            paper['link'].append(paper_link)


    df = pd.DataFrame.from_dict(paper)
    return df


def main():
    logging.basicConfig(filename='app.log', filemode='w', format='%(asctime)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S', level=logging.INFO)
    conn, cur = create_db()
    logging.info("Scraping started")
    df = scrape_jtiulm()
    logging.info("Scraping finished")
    sql_script = ("""INSERT INTO paper_details(
    title,
    author,
    link)
    VALUES (%s, %s, %s)
    """)
    for i, data in df.iterrows():
        logging.info(f'insert {i+1} row from {df.shape[0]} total row')
        cur.execute(sql_script, list(data))
    conn.commit()


if __name__ == '__main__':
    main()

```

## How to run the code for this project

if you used docker to run PostgreSQL, the initial step is to run `docker-compose up -d` command in your terminal. Once the process is completed, you can then execute the `python3 script.py` command to begin the script. Once everything's wrapped up, you can use DB administration tools to check the data. In my case, I prefer using DBeaver.

![DBeaver Configuration](https://drive.google.com/uc?export=view&id=1BKzWzhF4qQ3z6y7hdUz9Po6e5YlLdaRc)

- To connect to the database in this project, make sure you select PostgreSQL from the "Connect to a Database" menu. This is because PostgreSQL was the database management system used for this particular project.

![DBeaver Connection Settings](https://drive.google.com/uc?export=view&id=1zjABxjj-i15V0e5ee3cn2zv4LWKjs4QY)

- Once you've selected PostgreSQL in the previous menu, you'll need to define the settings based on your own database configuration. This includes specifying the host, port, database name, username, and password. In this case, the settings would be `host=localhost`, `port=5432`, `database=jtiulm`, `username=user`, and `password=root`. If you need to customize the database settings further, you can do so in the docker-compose.yml file.

![DBeaver Table Directory](https://drive.google.com/uc?export=view&id=1JJmjndi1QAZasam3jfSRfLrpa-mB1bNr)

- Table directory for this project.

  ![DBeaver Data View](https://drive.google.com/uc?export=view&id=14HtWv8DczCmoX5KtPFIbYEIXI960EpFh)

- The data that has been successfully loaded into the PostgreSQL database.
