---
author: Rizky Mubarok
pubDatetime: 2023-06-07T12:40:52.737Z
title: Building data-pipeline using Airflow, Docker and BigQuery
postSlug: data-pipeline-airflow-bigquery
featured: true
tags:
  - Data engineering
  - Python
  - Airflow
  - Docker
  - GCP
  - BeautifulSoup4
  - BigQuery
  - Terraform
ogImage: https://drive.google.com/uc?export=view&id=1kuaUMXZJtuaMda90I4oB4PNPfdR42ee9
description: Another Scrape paper data from https://jtiulm.ti.ft.ulm.ac.id project and load it into Google BigQuery using Airflow, Docker, Google Bigquery and Terraform as a tools. Discover the process of building simple data pipeline. This practical project to improve my knowledge about tools in data engineering field!
---

> So, in this post, I'm gonna break down how I manage this project from define airflow image with docker-compose and custom airflow image with Dockerfile, after that creating dataset resource in BigQuery using Terraform \*\*Optional. If you're curious about the code, you can check out the Github repository right over here: [Github Repository](https://github.com/gitbarok/Building-Data-Pipeline-using-Airflow--Docker--Terraform-and-Google-Bigquery).

## Table of contents

## Background

This project is actually a souped-up version of a script I made earlier. Check it out at [Scraping Jurnal-Klik Github Repository](https://github.com/gitbarok/scraping-jurnalklik). In the last one, I used Python and `BeautifulSoup4` to scrape some data, but then it was only saved in CSV format. But, in this new project, I'm taking it to the next level by using Airflow as composer, Docker, and loading all that scraped data into Google BigQuery.

## Highlevel Project Overview

![Workflow](https://drive.google.com/uc?export=view&id=1kuaUMXZJtuaMda90I4oB4PNPfdR42ee9)

## What tools to use?

Here is the list of the tools for this project:

| Tools           | Description                                        |
| --------------- | -------------------------------------------------- |
| **_Python_**    | Proggraming languange that we use in this project. |
| **_Docker_**    | Containerized airflow                              |
| **_Airflow_**   | Composer tools to schedule, and monitor workflows  |
| **_Terraform_** | infrastructure as a code tools \*\*Optional        |

## Tree Structured Directories

```
airflow_gcp
├── .credentials
│   └── google
│       └── google_credentials.json
├── terraform
│   ├── main.tf
│   └── variables.tf
└──  airflow
    ├── dags
    │   ├── helpers
    │   │  ├── local_to_bq.py
    │   │  └── scrape.py
    │   └── test_dag.py
    ├── Dockerfile
    ├── docker-compose.yaml
    └── requirements.txt
```

## Setup the project

### Airflow with Docker-compose

Karena pada project ini menggunakan docker untuk menjalankan airflow sebagai sebuah kontainer, alangkah baiknya jika Docker dan Docker compose sudah terinstall pada komputer yang digunakan. setelah itu buat dan pergi ke directory project dan jalankan perintah dibawah ini pada terminal untuk mengunduh file `docker-compose.yaml` instalasi airflow:

```yaml
#Mengunduh docker-compose.yaml file airflow
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.6.1/docker-compose.yaml'
```

Karena workstation yang saya gunakan bukan superbmainframecomputer, menjalankan airflow tanpa melakukan modifikasi pada file `docker-compose.yaml` dapat mengakibatkan workstation bekerja secara ekstra karena ada beberapa depedency yang sebenarnya tidak digunakan namun tetap memakan resource memory. merujuk pada artikel ini tentang bagaimana melakukan setup airflow versi ringan pada lokal komputer [How to Setup a Lightweight Local Version for Airflow](https://datatalks.club/blog/how-to-setup-lightweight-local-version-for-airflow.html#:~:text=3.-,Why%20this%20setup%20is%20lighter,-The%20main%20reason). Dibawah ini merupakan file `docker-compose.yaml` pada project ini setelah modifikasi:

```yaml
version: "3.8"
x-airflow-common: &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:2.6.1}
  environment: &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: LocalExecutor
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__FERNET_KEY: ""
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: "true"
    AIRFLOW__CORE__LOAD_EXAMPLES: "true"
    AIRFLOW__API__AUTH_BACKENDS: "airflow.api.auth.backend.basic_auth,airflow.api.auth.backend.session"
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: "true"
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}

  volumes:
    - ${AIRFLOW_PROJ_DIR:-.}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-.}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-.}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-.}/plugins:/opt/airflow/plugins
  user: "${AIRFLOW_UID:-50000}:0"
  depends_on: &airflow-common-depends-on
    postgres:
      condition: service_healthy

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 10s
      retries: 5
      start_period: 5s
    restart: always

  airflow-webserver:
    <<: *airflow-common
    command: webserver
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-scheduler:
    <<: *airflow-common
    command: scheduler
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8974/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-init:
    <<: *airflow-common
    entrypoint: /bin/bash
    # yamllint disable rule:line-length
    command:
      - -c
      - |
        function ver() {
          printf "%04d%04d%04d%04d" $${1//./ }
        }
        airflow_version=$$(AIRFLOW__LOGGING__LOGGING_LEVEL=INFO && gosu airflow airflow version)
        airflow_version_comparable=$$(ver $${airflow_version})
        min_airflow_version=2.2.0
        min_airflow_version_comparable=$$(ver $${min_airflow_version})
        if (( airflow_version_comparable < min_airflow_version_comparable )); then
          echo
          echo -e "\033[1;31mERROR!!!: Too old Airflow version $${airflow_version}!\e[0m"
          echo "The minimum Airflow version supported: $${min_airflow_version}. Only use this or higher!"
          echo
          exit 1
        fi
        if [[ -z "${AIRFLOW_UID}" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: AIRFLOW_UID not set!\e[0m"
          echo "If you are on Linux, you SHOULD follow the instructions below to set "
          echo "AIRFLOW_UID environment variable, otherwise files will be owned by root."
          echo "For other operating systems you can get rid of the warning with manually created .env file:"
          echo "    See: https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#setting-the-right-airflow-user"
          echo
        fi
        one_meg=1048576
        mem_available=$$(($$(getconf _PHYS_PAGES) * $$(getconf PAGE_SIZE) / one_meg))
        cpus_available=$$(grep -cE 'cpu[0-9]+' /proc/stat)
        disk_available=$$(df / | tail -1 | awk '{print $$4}')
        warning_resources="false"
        if (( mem_available < 4000 )) ; then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough memory available for Docker.\e[0m"
          echo "At least 4GB of memory required. You have $$(numfmt --to iec $$((mem_available * one_meg)))"
          echo
          warning_resources="true"
        fi
        if (( cpus_available < 2 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough CPUS available for Docker.\e[0m"
          echo "At least 2 CPUs recommended. You have $${cpus_available}"
          echo
          warning_resources="true"
        fi
        if (( disk_available < one_meg * 10 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough Disk space available for Docker.\e[0m"
          echo "At least 10 GBs recommended. You have $$(numfmt --to iec $$((disk_available * 1024 )))"
          echo
          warning_resources="true"
        fi
        if [[ $${warning_resources} == "true" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: You have not enough resources to run Airflow (see above)!\e[0m"
          echo "Please follow the instructions to increase amount of resources available:"
          echo "   https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#before-you-begin"
          echo
        fi
        mkdir -p /sources/logs /sources/dags /sources/plugins
        chown -R "${AIRFLOW_UID}:0" /sources/{logs,dags,plugins}
        exec /entrypoint airflow version
    # yamllint enable rule:line-length
    environment:
      <<: *airflow-common-env
      _AIRFLOW_DB_UPGRADE: "true"
      _AIRFLOW_WWW_USER_CREATE: "true"
      _AIRFLOW_WWW_USER_USERNAME: ${_AIRFLOW_WWW_USER_USERNAME:-airflow}
      _AIRFLOW_WWW_USER_PASSWORD: ${_AIRFLOW_WWW_USER_PASSWORD:-airflow}
      _PIP_ADDITIONAL_REQUIREMENTS: ""
    user: "0:0"
    volumes:
      - ${AIRFLOW_PROJ_DIR:-.}:/sources

volumes:
  postgres-db-volume:
```

Langkah selanjutnya adalah membuat 3 folder di local untuk keperluan airflow itu sendiri, setiap perubahan yang terjadi pada ketiga folder ini akan otomatis tercermin pada kontainer Airflow yang dijalankan dengan menggunakan docker:

```
mkdir -p ./dags ./logs ./plugins
```

Kita hanya akan fokus bermain pada folder `dags` untuk menaruh script python pada project ini.

Sekarang kita akan jalankan perintah dibawah ini pada terminal untuk melakukan migrasi database dan membuat akun pada airflow:

```
docker compose up airflow-init
```

setelah itu jalankan perintah dibawah ini untuk menjalankan kontainer airflow:

```
docker-compose up -d
```

Kita bisa melakukan pengecekan terhadap kontainer dengan menggunakan perintah `docker ps`, ketika kontainer airflow sudah siap digunakan, buka browser untuk mengakses web server pada http://localhost:8080/. dengan `username: airflow` dan `password: airflow`.

### Kustomisasi Airflow Docker image

Pada project ini kita akan melakukan proses scraping data dari website https://jtiulm.ti.ft.ulm.ac.id/index.php/jtiulm menggunakan `beautifulsoup4` lalu hasil dari proses scraping akan di load ke Bigquery, akan tetapi pada kontainer atau host yang telah kita buat dengan menggunakan docker-compose tidak terdapat library tersebut karena kontainer sifatnya terisolasi dan tidak punya akses terhadap library yang berada pada komputer kita, disinilah `Dockerfile` berperan penting untuk melakukan kostumisasi terhadap kontainer atau host yang telah kita buat sebelumnya yang akan digunakan untuk menginstall library yaang dibutuhkan.

Ini adalah list dari python library yang dibutuhkan untuk diinstall pada kontainer menggunakan Dockerfile, `requirements.txt`:

```
#requirements.txt
apache-airflow-providers-google
pandas
beautifulsoup4
requests
```

Dan ini adalah dockerfile yang digunakan untuk kustomisasi kontainer airflow untuk inisiasi library python yang dibutuhkan pada project ini:

```Dockerfile
FROM apache/airflow:2.6.1

ENV AIRFLOW_HOME=/opt/airflow #Define Root Folder Airflow

COPY requirements.txt /requirements.txt #Copy File requirements.txt(local) to Kontainer
RUN pip install --user --upgrade pip
RUN pip install --no-cache-dir --user -r /requirements.txt

WORKDIR $AIRFLOW_HOME

USER $AIRFLOW_UID

```

Selanjutnya kita dapat build docker image dengan menggunakan perintah:

```Docker
docker build . --tag airflow-dockerfile:latest #(airflow-dockerfile:latest adalah nama kustom untuk airflow image yang akan kita gunakan)
```

Setelah image airflow kustom berhasil dibuild, kita akan menggunakan image tersebut dengan mengganti image pada file `docker-compose.yaml`:

```yaml
x-airflow-common: &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:2.6.1}
```

Diganti menjadi:

```yaml
x-airflow-common: &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-airflow-dockerfile:latest}
```

### Inisisasi Environment Variable pada Docker Kontainer

Karena pada project ini kita menggunakan Bigquery untuk store data hasil scrape, sebaiknya kita harus menyiapkan GOOGLE_APPLICATION_CREDENTIALS yang akan ditempel pada airflow docker environment. Buatlah service account dengan role **Bigquery Admin** pada google cloud, dan generate JSON Credential file dan simpan pada folder `.credentials/google.<namafile>.json`.

Selanjutnya memodifikasi file `docker-compose.yaml` dengan menambahkan environment variable `GOOGLE_APPLICATION_CREDENTIALS` dan menambhakan volume directory untuk file tersebut, maka tampilan docker-compose akan menjadi sebagai berikut:

```yaml
version: "3.8"
x-airflow-common: &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-airflow-dockerfile:latest}
  environment: &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: LocalExecutor
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__FERNET_KEY: ""
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: "true"
    AIRFLOW__CORE__LOAD_EXAMPLES: "true"
    AIRFLOW__API__AUTH_BACKENDS: "airflow.api.auth.backend.basic_auth,airflow.api.auth.backend.session"
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: "true"
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}
    GOOGLE_APPLICATION_CREDENTIALS: /.credentials/google/<yourfile>.json #Google file credentials

  volumes:
    - ${AIRFLOW_PROJ_DIR:-.}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-.}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-.}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-.}/plugins:/opt/airflow/plugins
    - ../.credentials/google/:/.credentials/google:ro #Folder Credentials
```

### Menulis Script pada folder dags

Pada folder Airflow kita akan membuat subfolder dengan nama **helpers** yang digunakan untuk menyimpan script python untuk melakukan scraping halaman web dan ingest data ke Bigquery.

```python
#scrape.py
import requests
from bs4 import BeautifulSoup
import logging
import datetime
import pandas as pd


def scrape_jtiulm(output_file_name):
    # declare url target
    url = "https://jtiulm.ti.ft.ulm.ac.id/index.php/jtiulm/issue/archive"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    today = datetime.date.today()
    # get all link from the archive and stored in links as a list
    links = []
    for link in soup.find_all("a", class_="cover"):
        links.append(link.get("href"))

    paper = {
        "title": [],
        "author": [],
        "link": [],
        "date": [],
    }

    for link in links:
        page_a = requests.get(link)
        results_a = BeautifulSoup(page_a.content, "html.parser")
        for content in results_a.find_all("div", class_="obj_article_summary"):
            paper_title = content.find("div", class_="title").text.strip()
            paper_author = content.find("div", class_="authors").text
            paper_link = content.find("a").get("href")
            paper["title"].append(paper_title)
            paper["author"].append(paper_author.replace("\t", "").replace("\n", ""))
            paper["link"].append(paper_link)
            paper["date"].append(today)

    df = pd.DataFrame.from_dict(paper)
    logging.info(df.shape)
    # DataType
    df["title"] = df["title"].astype(str)
    df["author"] = df["author"].astype(str)
    df["link"] = df["link"].astype(str)
    df["date"] = df["date"].apply(pd.to_datetime)

    df.to_csv(output_file_name, index=False)


if __name__ == "__main__":
    scrape_jtiulm()
```

```python
#local_to_gcs.py
import pandas as pd
import os

from google.cloud import bigquery
from google.oauth2 import service_account


def load_to_bq(filename):
    # Define Variable
    SERVICE_ACCOUNT_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    PROJECT_ID = "FILL WITH YOUR PROJECT ID HERE"
    # ALL U NEED IS CREATE DATASET MANUALLY OR WITH TERRAFORM, AND JUST DEFINE TABLE NAME THAT YOU WANT, BIGQUERY WILL AUTOMATICALLY CREATE TABLE FOR U
    TABLE_ID = f"{PROJECT_ID}.[CHANGE TO YOUR DATASET NAME].[YOUR TABLE NAME IT WILL CREATE AUTOMATICALLY]"

    df = pd.read_csv(filename)

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_CREDENTIALS
    )
    client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

    job = client.load_table_from_dataframe(df, TABLE_ID)
    job.result()
    print("There are {0} rows added/changed".format(len(df)))


if __name__ == "__main__":
    load_to_bq()
```

Setelah selesai, kembali ke main folder dags untuk membuat DAG (Directed Acyclic Graph) is the core concept of Airflow, collecting Tasks together, organized with dependencies and relationships to say how they should run.

```python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

from helpers.scrape import scrape_jtiulm
from helpers.local_to_bq import load_to_bq


args = {
    "owner": "mubarok",
    "email": ["mubarok@gmail.com"],
    "retry_delay": timedelta(minutes=5),
}

dag = DAG(
    dag_id="test_dag",
    default_args=args,
    schedule_interval="0 9 * * 0",
    start_date=datetime(2023, 5, 30),
    dagrun_timeout=timedelta(minutes=60),
    max_active_runs=1,
)

scrape_jtiulm_task = PythonOperator(
    task_id="scrape_jtiulm_task",
    python_callable=scrape_jtiulm,
    op_kwargs={"output_file_name": "scrape_jtiulm_{{ ds }}.csv"}, #Output name
    dag=dag,
)

local_to_bq = PythonOperator(
    task_id="local_to_bq",
    python_callable=load_to_bq,
    op_kwargs={"filename": "scrape_jtiulm_{{ ds }}.csv"}, #Output name
    dag=dag,
)

delete_local_file = BashOperator(
    task_id="delete_local_file",
    bash_command="rm -rf scrape_jtiulm_{{ ds }}.csv",
    dag=dag,
)


scrape_jtiulm_task >> local_to_bq >> delete_local_file #Urutan task
```

### Membuat resource pada Gcloud dengan Terraform

Langkah ini sejujurnya bisa saja dilewatkan, tapi karena saya iseng ya saya lakukan hehehehe, disini menggunakan terraform untuk membuat dataset pada bigquery, sebenarnya bisa dengan cara manual menggunakan UI pada GCP, akan tetapi ini adalah sideproject, kalau tidak overengineering tidak afdol wkwkwkwkw.
Langkah pertama adalah pastinya anda telah menginstall terraform pada mesin anda dan buat folder dengan nama **Terraform**.
Pada folder tersebut buat terraform file dengan nama `main.tf` dan `variables.tf`.

Ini adalah main.tf file:

```yaml
#main.tf

#This main.tf file for creating dataset resource with code, not from gcloud UI
terraform {
  required_version = ">= 1.0"
  backend "local" {}
  required_providers {
    google = {
      source  = "hashicorp/google"
    }
  }
}

provider "google" {
  project = var.project_id
  region = "asia-southeast2"
  credentials = file("../.credentials/google/tactile-vehicle-351405-2d9915b8253e.json") #Change this to your credentials directory path
}

# Ref: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigquery_dataset
resource "google_bigquery_dataset" "dataset" {
  dataset_id = var.dataset_id
  project    = var.project_id
  location   = "US"
}
```

Dan ini adalah variables.tf file:

```yaml
variable "project_id" {
description = "The ID of the project in which to provision resources."
type        = string
default     = "FILL IN YOUR PROJECT ID HERE"
}

variable "dataset_id" {
description = "The dataset name of the project."
type        = string
default     = "FILL IN YOUR DATASET NAME HERE"
}
```

## How to run this project

### Terraform

Membuat resource menggunakan terraform, pergi ke folder terraform:

```
cd terraform
```

Lalu inisiasi terraform dengan menggunakan perintah:

```
terraform init
```

Dan buat resource dataset pada google bigquery menggunakan perintah:

```
terraform apply
```

Silahkan lakukan pengecekan pada google console, apakah resource yang telah kita buat reflected pada bigquery

### Airflow

Pergi ke folder airflow

```
cd airflow
```

Inisiasi airflow menggunakan docker-compose dan Dockerfile menggunakan perintah:

```
docker compose up airflow-init
```

Tunggu beberapa menit, setelah berhasil jalankan kontainer menggunakan perintah:

```
docker-compose up
```

Silahkan masuk pada Airflow webserver menggunakan web browser dengan laman `localhost:8080`.

Jika ingin stop container, jalankan perintah:

```
docker-compose down
```

## Resource/Rujukan

https://gitlab.com/marukun/line-webtoon-insight

https://medium.com/@alexroperez4/docker-airflow-gcp-80ef9280fbd3

https://datatalks.club/blog/how-to-setup-lightweight-local-version-for-airflow.html
