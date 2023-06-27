---
author: Rizky Mubarok
pubDatetime: 2023-06-22T05:10:09.000+08:00
title: Online Retail Ecommerce Transaction Analysis
postSlug: online-retail-ecommerce-analysis
featured: true
tags:
  - Data Visualization
  - Python
  - Data Analytics
description: The main purpose of this project is to enhance my data analytics portfolio by utilizing a Kaggle dataset on Online retail ecommerce transactions. I strive to visually represent the extracted insights, including Gross Merchandise Value (GMV), by employing Python along with the powerful Seaborn package.
---
> P.S I do not have domain knowledge or detailed understanding about this dataset, all of the code and analysis in this article based on my assumption and for practice purposes with python for data manipulation and data visualization :)))
However, please note that without domain knowledge or a detailed understanding of the dataset, it is important to approach these findings with caution.

## Table of contents

## Objective
In this project i conducted analysis to explore Online Retail Ecommerce dataset that i've got from kaggle, a little bit of descriptive analysis and data visualization.

## Data Overview
### About Dataset
In the field of e-commerce, the datasets are typically considered as proprietary, meaning they are owned and controlled by individual organizations and are not often made publicly available due to privacy and business considerations. In spite of this, The UCI Machine Learning Repository, known for its extensive collection of datasets beneficial for machine learning and data mining research, has curated and made accessible a unique dataset. This dataset comprises actual transactional data spanning from the year 2010 to 2011. For those interested, the dataset is maintained and readily available on the UCI Machine Learning Repository's site under the title "Online Retail".

The dataset is a transnational one, capturing every transaction made from December 1, 2010, through December 9, 2011, by a UK-based non-store online retail company. As an online retail entity, the company doesn't have a physical store presence, and its operations and sales are conducted purely online. The company's primary product offering includes unique gifts for all occasions. While the company serves a diverse range of customers, a significant number of its clientele includes wholesalers.

Link to the [dataset](https://www.kaggle.com/datasets/ineubytes/online-retail-ecommerce-dataset)

The dataset consists of several columns which could be highlighted as such:
1. InvoiceNo
2. StockCode
3. Description	
4. Quantity	
5. InvoiceDate	
6. UnitPrice	
7. CustomerID	
8. Country

Dataset are stored in csv file, to open it and do analysis we need to use pandas to convert it into pandas dataframe.

## Addresing data issue
There are several issue that we need to take care from this data, such as:
1. Dealing with Missing Values and Duplicated data
2. Resolving Data Inconsistencies
3. Adding an Aggregate Column for Analysis: TotalPrice Column (obtained by multiplying Quantity with UnitPrice) and Resolve Data Type Mismatches

### 1. Dealing with missing values and Duplicated data
First you need to import data with this line of code.
```python
df = pd.read_csv("/kaggle/input/online-retail-ecommerce-dataset/data.csv", encoding='ISO-8859-1')

### Since im using kaggle notebook, the dataset is straight from it :)
```

To find missing values using pandas for each of the columns in dataset, you can use this line of code.
``` python
df.isnull().sum()
```
On this dataset, we can see there are several columns that had null values.

<img src="https://drive.google.com/uc?export=view&id=1LMLOD368Et3Xh-B_rormKrUXlN_b1I8y" alt="Dataframe null values" width="250"/>

**Highlights**

There are two columns in the dataframe, namely Description and CustomerID, that contain missing values. We need to explore the missing values in these columns in order to determine the most appropriate method for handling them.
- Explore CustomerID Null values based on Country
  ```python
    df[df["CustomerID"].isna()]["Country"].unique()
  ```
    <img src="https://drive.google.com/uc?export=view&id=1NZwIy5MIozgF-y1EMIRxYenrFrQapL3c" alt="Dataframe null values" width="450"/>

    lets random sampling, specifically targeting records where the country is listed as "United Kingdom."
  ```python
    df_uk = df[df["Country"] == "United Kingdom"]
    print(df_uk.isnull().sum())
  ```
    <img src="https://drive.google.com/uc?export=view&id=1tUswp2q8VTJprqAH7Jk39nNOchDDrymo" alt="Dataframe null values" width="250"/>
    
    ```python
    df_uk[df_uk.isna().any(axis=1)]
    ````
    <img src="https://drive.google.com/uc?export=view&id=1s9sJ9zoEQhwVN2vF7aMOHrTB2FutaS7d" alt="UK Dataframe null values" width="450"/>

    To explore the relationship between transactions with null customerID values and those without, we will perform random sampling based on the InvoiceDate. This analysis aims to understand the behavioral patterns in these two groups of transactions.
    
    **A. UK Trasaction not null**
    
    ```python
    df_uk.query("InvoiceDate == '12/3/2010 11:42'")
    ````
    <img src="https://drive.google.com/uc?export=view&id=1gdvRIklf4EAupyTWESzbmwhDb_vDZ3l-" alt="UK Dataframe not null values" width="450"/>

    **B. UK Trasaction null**
    
    ```python
    df_uk.query("InvoiceDate == '12/1/2010 14:32'")
    ````
    <img src="https://drive.google.com/uc?export=view&id=1UEL5ngv_zsvQuhaG3PSf-gmZEk1Rto9z" alt="UK Dataframe null values" width="450"/>

    After conducting a thorough analysis of the CustomerID column and considering various methods for handling missing values, I have concluded that it is best to drop the CustomerID column. The missing values in this column appear to be too specific to the invoiceData and Country, making it difficult to impute or fill them accurately.

    However, if both the invoiceData and Country columns have the same value for a particular entry, with one having the real CustomerID and the other having NaN, I recommend using a forward fill or back fill method to handle the missing values. This approach involves copying the previous or subsequent non-missing value to fill in the missing CustomerID, based on the ordering of the dataset.
    ```python
    df = df.drop(columns="CustomerID")
    ```
- Explore duplicated data
    ```python
    df.loc[df.duplicated()]
    ```
    <img src="https://drive.google.com/uc?export=view&id=1Y3Kec4HUvvTLuMeE0GJGHJSAigEdGG9O" alt="DF Duplicated" width="450"/>

    Before proceeding with dropping the duplicate data, let's perform a random sampling to further analyze the duplicated entries. By conducting a deep dive into the duplicated data, we can gain more insights into the potential reasons for the duplication, such as input errors or other factors contributing to the repetition.
    ```python
    # Assume Invoice No is Unique
    df.query("InvoiceNo == '581538'").groupby("Description")["Description"].count().sort_values(ascending=False)
    ```
    <img src="https://drive.google.com/uc?export=view&id=1N5HH_14VcdWG87XUNiMNcnwdmB5CK3FW" alt="DF Duplicated" width="250"/>

    As you can see, there is multiple items inputted in the same invoiceID, Based on that and conclusion, it is appropriate to proceed with dropping the duplicate data.
    ```python
      df = df.loc[~df.duplicated()]
      df.isnull().sum()
    ```
    <img src="https://drive.google.com/uc?export=view&id=1qjUnfgoWzGuDqQqaJfmgVnkxyo96cY_4" alt="DF Null Sum" width="250"/>

### 2. Resolving Data Inconsistencies
```python
  df.describe()
```
  <img src="https://drive.google.com/uc?export=view&id=1xs7U0L8gw3WdZmSc9_U7bi3BQ647Xug4" alt="DF Describe" width="250"/>

  Why is there a minus value in the data? lets dive into it

```python
df.query("Quantity < 0")
```
  <img src="https://drive.google.com/uc?export=view&id=1oIy4VaTaHnpPrALBPg6vorpDe89szzj_" alt="Dataframe" width="450"/>

```python
df.query("UnitPrice <= 0")
```
  <img src="https://drive.google.com/uc?export=view&id=1VUHMp8o91td0gYryCTfCuNfPFgwonfvm" alt="Dataframe" width="450"/>

Is it imposibble if you buying something in ecommerce but quantity is minus and there is no price for products, again minus value is irrelevant, we need to drop it

```python
idx_minus= df[(df['Quantity'] < 0) | (df['UnitPrice'] <= 0) ].index ## To get the index
df = df.drop(idx_minus) ## Drop based on index
df.reset_index(drop=True)
df.describe()
```
  <img src="https://drive.google.com/uc?export=view&id=14UKsE2DfO7bypUjHfgYq-FsmTKO1n4WH" alt="DF Describe" width="250"/>

I understand that you might consider the possibility of outliers in this dataset due to values being significantly different from the median. However, in my humble opinion, I believe there is no need to take any action regarding the outlier data. This is because the dataset pertains to online retail, and it is reasonable to expect that some customers may make purchases in large quantities for various products, which is a natural occurrence.

### 3. Adding an Aggregate Column for Analysis and Resolve Data Type Mismatches
Need to change InvoiceDate column data type and add several new columns based on InvoiceData for wider analysis with this line of code.
```python
#Changing invoice Date Data Type
df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])

df['DayCode'] = df['InvoiceDate'].dt.dayofweek
df['DateYMD'] = df["InvoiceDate"].dt.date
df['DateYM'] = df['InvoiceDate'].dt.to_period('M')
df['Day'] = df['InvoiceDate'].dt.day_name()
# AGG Column
df['TotalPrice']= df['Quantity'] * df['UnitPrice']
df.dtypes
```
  <img src="https://drive.google.com/uc?export=view&id=1UT8jCiIg7Vv0vmaWWBN4ezkBKT_4TURx" alt="Dataframe Data Types" width="250"/>

```python
df.head(5)
```
  <img src="https://drive.google.com/uc?export=view&id=1uauHYiG6JVsau1e_PxF_OE6IRTUVLmKb" alt="Added Columns" width="450"/>

## Key Higlights based on Data
### Gross Merchandise Value
What Is Gross Merchandise Value (GMV)?
Gross merchandises value (GMV) is the total value of merchandise sold over a given period of time through a customer-to-customer (C2C) exchange site. It is a measure of the growth of the business or use of the site to sell merchandise owned by others.

Gross merchandise value (GMV) is often used to determine the health of an e-commerce site's business because its revenue will be a function of gross merchandise sold and fees charged. It is most useful as a comparative measure over time, such as current quarter value versus previous quarter value.

GMV is also known as gross merchandise volume; both phrases indicate the total monetary value of total sales. based on https://www.investopedia.com/terms/g/gross-merchandise-value.asp

### Gross Merchandise Value Trend 2010 December - 2011 December 
```python
df.groupby('DateYM')['TotalPrice'].sum().plot()
```
  <img src="https://drive.google.com/uc?export=view&id=17fUhcOrvGyJe4j4UrN-aO79YI73x-xGu" alt="GMV Linechart" width="450"/>

Highlights:

1. Fluctuation in Gross Merchandise Value (GMV) observed from December 2010 to July 2011.
2. GMV shows an upward trend from August 2011 to October 2011, reaching its peak in November 2011.
3. A significant decline in GMV is observed in December 2011, indicating a sharp drop in sales or transaction volume during that period.

### Top 10 Country based on Transaction Value
To group the data by country and calculate the aggregate function to identify the highest transaction value across the dataset, you can utilize the following line of code.
```python
top10_gmvcountry = df.groupby("Country")['TotalPrice'].sum() \
          .sort_values(ascending=False) \
          .head(10) \
          .reset_index()

#Plot the data
ax = sns.barplot(data=top10_gmvcountry, x="Country", y="TotalPrice")
plt.yscale("log")
ax.figure.set_size_inches(20,10)
ax.set_ylabel("Transaction Value")
```
  <img src="https://drive.google.com/uc?export=view&id=1RRLrE_lGip1C2eZSt8-S1ZeUhwIBUUQb" alt="Top 10 Country" width="550"/>

Based on the bar-chart above, United kingdom is the leader in terms of transaction value.

### Top 5 Products based on Transaction Value
To group the data by Products and calculate the aggregate function to identify the highest transaction value across the dataset, you can utilize the following line of code.
```python
top5_producstgmv = df.groupby("Description").agg({"TotalPrice": "sum"}) \
                    .sort_values(by="TotalPrice", ascending=False).head(5) \
                    .reset_index() \
                    .rename(columns={"TotalPrice": "TransactionValue", "Description":"Products"})

#Plot the data
sns.barplot(data=top5_producstgmv, x="TransactionValue", y="Products")
```
  <img src="https://drive.google.com/uc?export=view&id=11OzjSUDhzFAaVGcembxHMXiXz_YUNlQT" alt="Top 5 Products" width="550"/>

  Based on the bar-chart above, Dotcom Postage is the leader in terms of transaction value.

### The Favorite day for Shopping
```python
df_by_day = df.groupby(["Day", "DayCode"]).agg({"TotalPrice": "sum", "InvoiceNo":"count"}) \
            .reset_index() \
            .sort_values(by="DayCode") \
            .rename(columns = {"TotalPrice":"ValueTransaction", "InvoiceNo":"NumberOfOrders"})

# plot line graph on axis #1
ax1 = sns.lineplot(data=df_by_day, x="Day", y="ValueTransaction" ,color='blue')
ax1.legend(['Value Transaction'], loc="upper left")
ax2 = ax1.twinx()
# plot bar graph on axis #2
sns.lineplot(data=df_by_day, x="Day", y="NumberOfOrders", color='orange', alpha=0.5, ax = ax2)
ax2.legend(['NumberOfOrders'], loc="upper right")
plt.show()
```
  <img src="https://drive.google.com/uc?export=view&id=10cnjwF5zTqK4wb-1uV3fHZISIEz-pv2H" alt="Best Day Shopping" width="550"/>

Based on the chart above,  it appears that the transaction value and number of orders exhibit fluctuation throughout the weekdays. However, a notable pattern is observed wherein both metrics experience a substantial drop every time the weekend arrives.