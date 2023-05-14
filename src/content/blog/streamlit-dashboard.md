---
author: Rizky Mubarok
pubDatetime: 2023-05-13T23:09:09.000+08:00
title: Data Visualization with Streamlit and Tableau
postSlug: data-visualization-streamlit-tableau
featured: true
tags:
  - Data Visualization
  - Python
  - Streamlit
  - Tableau
description: Data visualization is a powerful tool that allows us to explore and understand complex data sets in a more intuitive way. In this blog post, we'll dive into the minimum wage in DI Yogyakarta and demonstrate how to create visualizations using two popular tools, Streamlit and Tableau.
---

> So, in this post, I'm gonna break down how I manage this project from start to finish - that includes data preparation and data visualization. If you're curious about the code, you can check out the Github repository right over here: [Github Repository](https://github.com/gitbarok/Data-Preparation-and-VIsualization-UMP-Kabupaten-Provinsi-DI-Yogyakarta) and you can check the tableau version of this dashboard with this link [Tableau Public](https://public.tableau.com/views/VisualisasiUMPProvinsiDIY/VisualisasiUMPProvinsiDaerahIstimewaYogyakarta?:language=en-US&:display_count=n&:origin=viz_share_link) . But just a heads up - I'm assuming for this project you've got some basic knowledge of Python.

## Table of contents

## Background

This project is actually just for practice. I'm trying out the Streamlit library for the first time as a data visualization tool. Normally, I use Tableau or Looker Studio for this kind of thing, but I figured I'd mix it up a bit and try something new :), so yeah, check it out!

## What tools to use?

Here is the list of the tools for this project:

| Tools         | Description                                        | Notes                 |
| ------------- | -------------------------------------------------- | --------------------- |
| **_Python_**  | Proggraming languange that we use in this project. | required<sup>\*</sup> |
| **_Tableau_** | Data Visualization Tools.                          | optional<sup>\*</sup> |

To begin with this project, you just need to have Python installed and then install the library that is related to this project. The first step is to clone the Github repository in the link above, and once that's done, navigate to the repository folder and type the command `pip install -r requirements.txt` in your terminal. it will install all the necessary dependencies for this project.

## Let's Code!

## Data Cleansing

```python
import pandas as pd
import numpy as np
import datetime
import time
```

```python
for i in os.listdir('../data/raw'):
    print(i)

# i got all the data from this link: https://yogyakarta.bps.go.id/indicator/6/272/1/upah-minimum-kabupaten-upah-minimum-provinsi-di-di-yogyakarta.html
```

    Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta.xlsx
    Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (3).xlsx
    Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (1).xlsx
    Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (2).xlsx

#### There is 4 files, so we need to squeeze the files into 1 file for easier data cleansing.

```python
df_1 = pd.read_excel('../data/raw/Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta.xlsx')
df_2 = pd.read_excel('../data/raw/Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (1).xlsx')
df_3 = pd.read_excel('../data/raw/Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (2).xlsx')
df_4 = pd.read_excel('../data/raw/Upah Minimum Kabupaten_Upah Minimum Provinsi di DI Yogyakarta (3).xlsx')

```

```python
# display the first five rows for each dataframe
display(df_1.head())
display(df_2.head())
display(df_3.head())
display(df_4.head())
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>nama_daerah</th>
      <th>2012</th>
      <th>2013</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>-</td>
      <td>954339</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>-</td>
      <td>993484</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>-</td>
      <td>947114</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>-</td>
      <td>1026181</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>-</td>
      <td>1065247</td>
    </tr>
  </tbody>
</table>
</div>

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>nama_daerah</th>
      <th>2014</th>
      <th>2015</th>
      <th>2016</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>1069000</td>
      <td>1138000</td>
      <td>1268870</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>1125500</td>
      <td>1163800</td>
      <td>1297700</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>988500</td>
      <td>1108249</td>
      <td>1235700</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1127000</td>
      <td>1200000</td>
      <td>1338000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>1173300</td>
      <td>1302500</td>
      <td>1452400</td>
    </tr>
  </tbody>
</table>
</div>

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>nama_daerah</th>
      <th>2017</th>
      <th>2018</th>
      <th>2019</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>1373600</td>
      <td>1493250</td>
      <td>1613200</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>1404760</td>
      <td>1572150</td>
      <td>1649800</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>1337650</td>
      <td>1454200</td>
      <td>1571000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1448385</td>
      <td>1574550</td>
      <td>1701000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>1572200</td>
      <td>1709150</td>
      <td>1848400</td>
    </tr>
  </tbody>
</table>
</div>

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>nama_daerah</th>
      <th>2020</th>
      <th>2021</th>
      <th>2022</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>1750500</td>
      <td>1770000</td>
      <td>1904275</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>1790500</td>
      <td>1805000</td>
      <td>1916848</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>1705000</td>
      <td>1842460</td>
      <td>1900000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1846000</td>
      <td>1903500</td>
      <td>2001000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>2004000</td>
      <td>2069530</td>
      <td>2153970</td>
    </tr>
  </tbody>
</table>
</div>

### because there is only (-) field in column 2012 we need to drop it first

```python
#Drop 2012 Column
df_1.drop(df_1.columns[1], axis=1, inplace=True)
df_1.head()
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>nama_daerah</th>
      <th>2013</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>954339</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>993484</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>947114</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1026181</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>1065247</td>
    </tr>
  </tbody>
</table>
</div>

### After we drop 2012 column, lets merge all the dataframe

```python
#Merge all the data frame
df_1_2 = df_1.merge(df_2, on='nama_daerah', how='outer')
df_3_4 = df_3.merge(df_4, on='nama_daerah', how='outer')
df_merged = df_1_2.merge(df_3_4, on='nama_daerah', how='outer')
print(display(df_merged))

```

```python
#Change name column
df_merged = df_merged.rename(columns={'nama_daerah':'Kabupaten'})
df_merged.head()
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe" width="100">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>Kabupaten</th>
      <th>2013</th>
      <th>2014</th>
      <th>2015</th>
      <th>2016</th>
      <th>2017</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>954339</td>
      <td>1069000</td>
      <td>1138000</td>
      <td>1268870</td>
      <td>1373600</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>993484</td>
      <td>1125500</td>
      <td>1163800</td>
      <td>1297700</td>
      <td>1404760</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>947114</td>
      <td>988500</td>
      <td>1108249</td>
      <td>1235700</td>
      <td>1337650</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1026181</td>
      <td>1127000</td>
      <td>1200000</td>
      <td>1338000</td>
      <td>1448385</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>1065247</td>
      <td>1173300</td>
      <td>1302500</td>
      <td>1452400</td>
      <td>1572200</td>
    </tr>
  </tbody>
</table>
</div>

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: ;
    }

</style>
<table border="1" class="dataframe" width="100">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>nama_daerah</th>
      <th>2018</th>
      <th>2019</th>
      <th>2020</th>
      <th>2021</th>
      <th>2022</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>1493250</td>
      <td>1613200</td>
      <td>1750500</td>
      <td>1770000</td>
      <td>1904275</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>1572150</td>
      <td>1649800</td>
      <td>1790500</td>
      <td>1805000</td>
      <td>1916848</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>1454200</td>
      <td>1571000</td>
      <td>1705000</td>
      <td>1842460</td>
      <td>1900000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>1574550</td>
      <td>1701000</td>
      <td>1846000</td>
      <td>1903500</td>
      <td>2001000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>1709150</td>
      <td>1848400</td>
      <td>2004000</td>
      <td>2069530</td>
      <td>2153970</td>
    </tr>
  </tbody>
</table>
</div>

### data looks good, so we have 5 districts in DI Yogyakarta with minimum wage records from 2013 to 2022, but for the data to be visualized easily we need to convert the dataframe format using pandas melt.

```python
df_melt = pd.melt(df_merged, id_vars=['Kabupaten'], value_vars=df_merged.columns[1:], var_name='Tahun',value_name='Upah Minimum')

df_melt
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>Kabupaten</th>
      <th>Tahun</th>
      <th>Upah Minimum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>2013</td>
      <td>954339</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>2013</td>
      <td>993484</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>2013</td>
      <td>947114</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>2013</td>
      <td>1026181</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>2013</td>
      <td>1065247</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Kulonprogo</td>
      <td>2014</td>
      <td>1069000</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Bantul</td>
      <td>2014</td>
      <td>1125500</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Gunungkidul</td>
      <td>2014</td>
      <td>988500</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Sleman</td>
      <td>2014</td>
      <td>1127000</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Yogyakarta</td>
      <td>2014</td>
      <td>1173300</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Kulonprogo</td>
      <td>2015</td>
      <td>1138000</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Bantul</td>
      <td>2015</td>
      <td>1163800</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Gunungkidul</td>
      <td>2015</td>
      <td>1108249</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Sleman</td>
      <td>2015</td>
      <td>1200000</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Yogyakarta</td>
      <td>2015</td>
      <td>1302500</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Kulonprogo</td>
      <td>2016</td>
      <td>1268870</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Bantul</td>
      <td>2016</td>
      <td>1297700</td>
    </tr>
    <tr>
      <th>17</th>
      <td>Gunungkidul</td>
      <td>2016</td>
      <td>1235700</td>
    </tr>
    <tr>
      <th>18</th>
      <td>Sleman</td>
      <td>2016</td>
      <td>1338000</td>
    </tr>
    <tr>
      <th>19</th>
      <td>Yogyakarta</td>
      <td>2016</td>
      <td>1452400</td>
    </tr>
    <tr>
      <th>20</th>
      <td>Kulonprogo</td>
      <td>2017</td>
      <td>1373600</td>
    </tr>
    <tr>
      <th>21</th>
      <td>Bantul</td>
      <td>2017</td>
      <td>1404760</td>
    </tr>
    <tr>
      <th>22</th>
      <td>Gunungkidul</td>
      <td>2017</td>
      <td>1337650</td>
    </tr>
    <tr>
      <th>23</th>
      <td>Sleman</td>
      <td>2017</td>
      <td>1448385</td>
    </tr>
    <tr>
      <th>24</th>
      <td>Yogyakarta</td>
      <td>2017</td>
      <td>1572200</td>
    </tr>
    <tr>
      <th>25</th>
      <td>Kulonprogo</td>
      <td>2018</td>
      <td>1493250</td>
    </tr>
    <tr>
      <th>26</th>
      <td>Bantul</td>
      <td>2018</td>
      <td>1572150</td>
    </tr>
    <tr>
      <th>27</th>
      <td>Gunungkidul</td>
      <td>2018</td>
      <td>1454200</td>
    </tr>
    <tr>
      <th>28</th>
      <td>Sleman</td>
      <td>2018</td>
      <td>1574550</td>
    </tr>
    <tr>
      <th>29</th>
      <td>Yogyakarta</td>
      <td>2018</td>
      <td>1709150</td>
    </tr>
    <tr>
      <th>30</th>
      <td>Kulonprogo</td>
      <td>2019</td>
      <td>1613200</td>
    </tr>
    <tr>
      <th>31</th>
      <td>Bantul</td>
      <td>2019</td>
      <td>1649800</td>
    </tr>
    <tr>
      <th>32</th>
      <td>Gunungkidul</td>
      <td>2019</td>
      <td>1571000</td>
    </tr>
    <tr>
      <th>33</th>
      <td>Sleman</td>
      <td>2019</td>
      <td>1701000</td>
    </tr>
    <tr>
      <th>34</th>
      <td>Yogyakarta</td>
      <td>2019</td>
      <td>1848400</td>
    </tr>
    <tr>
      <th>35</th>
      <td>Kulonprogo</td>
      <td>2020</td>
      <td>1750500</td>
    </tr>
    <tr>
      <th>36</th>
      <td>Bantul</td>
      <td>2020</td>
      <td>1790500</td>
    </tr>
    <tr>
      <th>37</th>
      <td>Gunungkidul</td>
      <td>2020</td>
      <td>1705000</td>
    </tr>
    <tr>
      <th>38</th>
      <td>Sleman</td>
      <td>2020</td>
      <td>1846000</td>
    </tr>
    <tr>
      <th>39</th>
      <td>Yogyakarta</td>
      <td>2020</td>
      <td>2004000</td>
    </tr>
    <tr>
      <th>40</th>
      <td>Kulonprogo</td>
      <td>2021</td>
      <td>1770000</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Bantul</td>
      <td>2021</td>
      <td>1805000</td>
    </tr>
    <tr>
      <th>42</th>
      <td>Gunungkidul</td>
      <td>2021</td>
      <td>1842460</td>
    </tr>
    <tr>
      <th>43</th>
      <td>Sleman</td>
      <td>2021</td>
      <td>1903500</td>
    </tr>
    <tr>
      <th>44</th>
      <td>Yogyakarta</td>
      <td>2021</td>
      <td>2069530</td>
    </tr>
    <tr>
      <th>45</th>
      <td>Kulonprogo</td>
      <td>2022</td>
      <td>1904275</td>
    </tr>
    <tr>
      <th>46</th>
      <td>Bantul</td>
      <td>2022</td>
      <td>1916848</td>
    </tr>
    <tr>
      <th>47</th>
      <td>Gunungkidul</td>
      <td>2022</td>
      <td>1900000</td>
    </tr>
    <tr>
      <th>48</th>
      <td>Sleman</td>
      <td>2022</td>
      <td>2001000</td>
    </tr>
    <tr>
      <th>49</th>
      <td>Yogyakarta</td>
      <td>2022</td>
      <td>2153970</td>
    </tr>
  </tbody>
</table>
</div>

```python
df_melt.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 50 entries, 0 to 49
    Data columns (total 3 columns):
     #   Column        Non-Null Count  Dtype
    ---  ------        --------------  -----
     0   Kabupaten     50 non-null     object
     1   Tahun         50 non-null     object
     2   Upah Minimum  50 non-null     int64
    dtypes: int64(1), object(2)
    memory usage: 1.3+ KB

##### since column tahun is an object, we need to convert it to int, so maybe in the future we can use it to do some processing

```python
df_melt['Tahun'] = df_melt['Tahun'].astype('int')
df_melt.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 50 entries, 0 to 49
    Data columns (total 3 columns):
     #   Column        Non-Null Count  Dtype
    ---  ------        --------------  -----
     0   Kabupaten     50 non-null     object
     1   Tahun         50 non-null     int64
     2   Upah Minimum  50 non-null     int64
    dtypes: int64(2), object(1)
    memory usage: 1.3+ KB

```python
# lets take a sample the data from 2021
df_melt[df_melt['Tahun']==2021]
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>Kabupaten</th>
      <th>Tahun</th>
      <th>Upah Minimum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>40</th>
      <td>Kulonprogo</td>
      <td>2021</td>
      <td>1770000</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Bantul</td>
      <td>2021</td>
      <td>1805000</td>
    </tr>
    <tr>
      <th>42</th>
      <td>Gunungkidul</td>
      <td>2021</td>
      <td>1842460</td>
    </tr>
    <tr>
      <th>43</th>
      <td>Sleman</td>
      <td>2021</td>
      <td>1903500</td>
    </tr>
    <tr>
      <th>44</th>
      <td>Yogyakarta</td>
      <td>2021</td>
      <td>2069530</td>
    </tr>
  </tbody>
</table>
</div>

### Lets add another column for yearly increase in percent and different amount yearly

```python
df_melt['Prev ump'] = df_melt.groupby('Kabupaten')['Upah Minimum'].shift(1)
df_melt['Different Amount Yearly'] = df_melt['Upah Minimum'] - df_melt['Prev ump']
df_melt['Increase Percentage'] = (((df_melt['Upah Minimum'] - df_melt['Prev ump']) / df_melt['Prev ump']) * 100).round(2)
df_melt
```

<div>

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>Kabupaten</th>
      <th>Tahun</th>
      <th>Upah Minimum</th>
      <th>Prev ump</th>
      <th>Different Amount Yearly</th>
      <th>Increase Percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>2013</td>
      <td>954339</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>2013</td>
      <td>993484</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>2013</td>
      <td>947114</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>2013</td>
      <td>1026181</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>2013</td>
      <td>1065247</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Kulonprogo</td>
      <td>2014</td>
      <td>1069000</td>
      <td>954339.0</td>
      <td>114661.0</td>
      <td>12.01</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Bantul</td>
      <td>2014</td>
      <td>1125500</td>
      <td>993484.0</td>
      <td>132016.0</td>
      <td>13.29</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Gunungkidul</td>
      <td>2014</td>
      <td>988500</td>
      <td>947114.0</td>
      <td>41386.0</td>
      <td>4.37</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Sleman</td>
      <td>2014</td>
      <td>1127000</td>
      <td>1026181.0</td>
      <td>100819.0</td>
      <td>9.82</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Yogyakarta</td>
      <td>2014</td>
      <td>1173300</td>
      <td>1065247.0</td>
      <td>108053.0</td>
      <td>10.14</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Kulonprogo</td>
      <td>2015</td>
      <td>1138000</td>
      <td>1069000.0</td>
      <td>69000.0</td>
      <td>6.45</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Bantul</td>
      <td>2015</td>
      <td>1163800</td>
      <td>1125500.0</td>
      <td>38300.0</td>
      <td>3.40</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Gunungkidul</td>
      <td>2015</td>
      <td>1108249</td>
      <td>988500.0</td>
      <td>119749.0</td>
      <td>12.11</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Sleman</td>
      <td>2015</td>
      <td>1200000</td>
      <td>1127000.0</td>
      <td>73000.0</td>
      <td>6.48</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Yogyakarta</td>
      <td>2015</td>
      <td>1302500</td>
      <td>1173300.0</td>
      <td>129200.0</td>
      <td>11.01</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Kulonprogo</td>
      <td>2016</td>
      <td>1268870</td>
      <td>1138000.0</td>
      <td>130870.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Bantul</td>
      <td>2016</td>
      <td>1297700</td>
      <td>1163800.0</td>
      <td>133900.0</td>
      <td>11.51</td>
    </tr>
    <tr>
      <th>17</th>
      <td>Gunungkidul</td>
      <td>2016</td>
      <td>1235700</td>
      <td>1108249.0</td>
      <td>127451.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>18</th>
      <td>Sleman</td>
      <td>2016</td>
      <td>1338000</td>
      <td>1200000.0</td>
      <td>138000.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>19</th>
      <td>Yogyakarta</td>
      <td>2016</td>
      <td>1452400</td>
      <td>1302500.0</td>
      <td>149900.0</td>
      <td>11.51</td>
    </tr>
    <tr>
      <th>20</th>
      <td>Kulonprogo</td>
      <td>2017</td>
      <td>1373600</td>
      <td>1268870.0</td>
      <td>104730.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>21</th>
      <td>Bantul</td>
      <td>2017</td>
      <td>1404760</td>
      <td>1297700.0</td>
      <td>107060.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>22</th>
      <td>Gunungkidul</td>
      <td>2017</td>
      <td>1337650</td>
      <td>1235700.0</td>
      <td>101950.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>23</th>
      <td>Sleman</td>
      <td>2017</td>
      <td>1448385</td>
      <td>1338000.0</td>
      <td>110385.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>24</th>
      <td>Yogyakarta</td>
      <td>2017</td>
      <td>1572200</td>
      <td>1452400.0</td>
      <td>119800.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>25</th>
      <td>Kulonprogo</td>
      <td>2018</td>
      <td>1493250</td>
      <td>1373600.0</td>
      <td>119650.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>26</th>
      <td>Bantul</td>
      <td>2018</td>
      <td>1572150</td>
      <td>1404760.0</td>
      <td>167390.0</td>
      <td>11.92</td>
    </tr>
    <tr>
      <th>27</th>
      <td>Gunungkidul</td>
      <td>2018</td>
      <td>1454200</td>
      <td>1337650.0</td>
      <td>116550.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>28</th>
      <td>Sleman</td>
      <td>2018</td>
      <td>1574550</td>
      <td>1448385.0</td>
      <td>126165.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>29</th>
      <td>Yogyakarta</td>
      <td>2018</td>
      <td>1709150</td>
      <td>1572200.0</td>
      <td>136950.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>30</th>
      <td>Kulonprogo</td>
      <td>2019</td>
      <td>1613200</td>
      <td>1493250.0</td>
      <td>119950.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>31</th>
      <td>Bantul</td>
      <td>2019</td>
      <td>1649800</td>
      <td>1572150.0</td>
      <td>77650.0</td>
      <td>4.94</td>
    </tr>
    <tr>
      <th>32</th>
      <td>Gunungkidul</td>
      <td>2019</td>
      <td>1571000</td>
      <td>1454200.0</td>
      <td>116800.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>33</th>
      <td>Sleman</td>
      <td>2019</td>
      <td>1701000</td>
      <td>1574550.0</td>
      <td>126450.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>34</th>
      <td>Yogyakarta</td>
      <td>2019</td>
      <td>1848400</td>
      <td>1709150.0</td>
      <td>139250.0</td>
      <td>8.15</td>
    </tr>
    <tr>
      <th>35</th>
      <td>Kulonprogo</td>
      <td>2020</td>
      <td>1750500</td>
      <td>1613200.0</td>
      <td>137300.0</td>
      <td>8.51</td>
    </tr>
    <tr>
      <th>36</th>
      <td>Bantul</td>
      <td>2020</td>
      <td>1790500</td>
      <td>1649800.0</td>
      <td>140700.0</td>
      <td>8.53</td>
    </tr>
    <tr>
      <th>37</th>
      <td>Gunungkidul</td>
      <td>2020</td>
      <td>1705000</td>
      <td>1571000.0</td>
      <td>134000.0</td>
      <td>8.53</td>
    </tr>
    <tr>
      <th>38</th>
      <td>Sleman</td>
      <td>2020</td>
      <td>1846000</td>
      <td>1701000.0</td>
      <td>145000.0</td>
      <td>8.52</td>
    </tr>
    <tr>
      <th>39</th>
      <td>Yogyakarta</td>
      <td>2020</td>
      <td>2004000</td>
      <td>1848400.0</td>
      <td>155600.0</td>
      <td>8.42</td>
    </tr>
    <tr>
      <th>40</th>
      <td>Kulonprogo</td>
      <td>2021</td>
      <td>1770000</td>
      <td>1750500.0</td>
      <td>19500.0</td>
      <td>1.11</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Bantul</td>
      <td>2021</td>
      <td>1805000</td>
      <td>1790500.0</td>
      <td>14500.0</td>
      <td>0.81</td>
    </tr>
    <tr>
      <th>42</th>
      <td>Gunungkidul</td>
      <td>2021</td>
      <td>1842460</td>
      <td>1705000.0</td>
      <td>137460.0</td>
      <td>8.06</td>
    </tr>
    <tr>
      <th>43</th>
      <td>Sleman</td>
      <td>2021</td>
      <td>1903500</td>
      <td>1846000.0</td>
      <td>57500.0</td>
      <td>3.11</td>
    </tr>
    <tr>
      <th>44</th>
      <td>Yogyakarta</td>
      <td>2021</td>
      <td>2069530</td>
      <td>2004000.0</td>
      <td>65530.0</td>
      <td>3.27</td>
    </tr>
    <tr>
      <th>45</th>
      <td>Kulonprogo</td>
      <td>2022</td>
      <td>1904275</td>
      <td>1770000.0</td>
      <td>134275.0</td>
      <td>7.59</td>
    </tr>
    <tr>
      <th>46</th>
      <td>Bantul</td>
      <td>2022</td>
      <td>1916848</td>
      <td>1805000.0</td>
      <td>111848.0</td>
      <td>6.20</td>
    </tr>
    <tr>
      <th>47</th>
      <td>Gunungkidul</td>
      <td>2022</td>
      <td>1900000</td>
      <td>1842460.0</td>
      <td>57540.0</td>
      <td>3.12</td>
    </tr>
    <tr>
      <th>48</th>
      <td>Sleman</td>
      <td>2022</td>
      <td>2001000</td>
      <td>1903500.0</td>
      <td>97500.0</td>
      <td>5.12</td>
    </tr>
    <tr>
      <th>49</th>
      <td>Yogyakarta</td>
      <td>2022</td>
      <td>2153970</td>
      <td>2069530.0</td>
      <td>84440.0</td>
      <td>4.08</td>
    </tr>
  </tbody>
</table>
</div>

```python
df_melt[df_melt['Kabupaten']== "Bantul"]
```

<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th></th>
      <th>Kabupaten</th>
      <th>Tahun</th>
      <th>Upah Minimum</th>
      <th>Prev ump</th>
      <th>Different Amount Yearly</th>
      <th>Increase Percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>2013</td>
      <td>993484</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Bantul</td>
      <td>2014</td>
      <td>1125500</td>
      <td>993484.0</td>
      <td>132016.0</td>
      <td>13.29</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Bantul</td>
      <td>2015</td>
      <td>1163800</td>
      <td>1125500.0</td>
      <td>38300.0</td>
      <td>3.40</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Bantul</td>
      <td>2016</td>
      <td>1297700</td>
      <td>1163800.0</td>
      <td>133900.0</td>
      <td>11.51</td>
    </tr>
    <tr>
      <th>21</th>
      <td>Bantul</td>
      <td>2017</td>
      <td>1404760</td>
      <td>1297700.0</td>
      <td>107060.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>26</th>
      <td>Bantul</td>
      <td>2018</td>
      <td>1572150</td>
      <td>1404760.0</td>
      <td>167390.0</td>
      <td>11.92</td>
    </tr>
    <tr>
      <th>31</th>
      <td>Bantul</td>
      <td>2019</td>
      <td>1649800</td>
      <td>1572150.0</td>
      <td>77650.0</td>
      <td>4.94</td>
    </tr>
    <tr>
      <th>36</th>
      <td>Bantul</td>
      <td>2020</td>
      <td>1790500</td>
      <td>1649800.0</td>
      <td>140700.0</td>
      <td>8.53</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Bantul</td>
      <td>2021</td>
      <td>1805000</td>
      <td>1790500.0</td>
      <td>14500.0</td>
      <td>0.81</td>
    </tr>
    <tr>
      <th>46</th>
      <td>Bantul</td>
      <td>2022</td>
      <td>1916848</td>
      <td>1805000.0</td>
      <td>111848.0</td>
      <td>6.20</td>
    </tr>
  </tbody>
</table>
</div>

```python
## change column name into snake_case
def snakecase_columns_name(df):
    df_new = df.copy()
    df_new.columns = (
        (df_new.columns.str.lower())
        .str.replace(' ', '_')
    )
    return df_new

df_clean = snakecase_columns_name(df_melt)
df_clean.head()


```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>kabupaten</th>
      <th>tahun</th>
      <th>upah_minimum</th>
      <th>prev_ump</th>
      <th>different_amount_yearly</th>
      <th>increase_percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>2013</td>
      <td>954339</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>2013</td>
      <td>993484</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>2013</td>
      <td>947114</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>2013</td>
      <td>1026181</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>2013</td>
      <td>1065247</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>

### The data is ready to be visualized

```python
df_clean.to_csv('../data/processed/DI-Yogyakarta Minimum Wage.csv', index=False)
```

## Data visualization prototyping

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
```

```python
df = pd.read_csv('../data/processed/DI-Yogyakarta Minimum Wage.csv')
df
```

<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>kabupaten</th>
      <th>tahun</th>
      <th>upah_minimum</th>
      <th>prev_ump</th>
      <th>different_amount_yearly</th>
      <th>increase_percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Kulonprogo</td>
      <td>2013</td>
      <td>954339</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bantul</td>
      <td>2013</td>
      <td>993484</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Gunungkidul</td>
      <td>2013</td>
      <td>947114</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Sleman</td>
      <td>2013</td>
      <td>1026181</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Yogyakarta</td>
      <td>2013</td>
      <td>1065247</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Kulonprogo</td>
      <td>2014</td>
      <td>1069000</td>
      <td>954339.0</td>
      <td>114661.0</td>
      <td>12.01</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Bantul</td>
      <td>2014</td>
      <td>1125500</td>
      <td>993484.0</td>
      <td>132016.0</td>
      <td>13.29</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Gunungkidul</td>
      <td>2014</td>
      <td>988500</td>
      <td>947114.0</td>
      <td>41386.0</td>
      <td>4.37</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Sleman</td>
      <td>2014</td>
      <td>1127000</td>
      <td>1026181.0</td>
      <td>100819.0</td>
      <td>9.82</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Yogyakarta</td>
      <td>2014</td>
      <td>1173300</td>
      <td>1065247.0</td>
      <td>108053.0</td>
      <td>10.14</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Kulonprogo</td>
      <td>2015</td>
      <td>1138000</td>
      <td>1069000.0</td>
      <td>69000.0</td>
      <td>6.45</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Bantul</td>
      <td>2015</td>
      <td>1163800</td>
      <td>1125500.0</td>
      <td>38300.0</td>
      <td>3.40</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Gunungkidul</td>
      <td>2015</td>
      <td>1108249</td>
      <td>988500.0</td>
      <td>119749.0</td>
      <td>12.11</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Sleman</td>
      <td>2015</td>
      <td>1200000</td>
      <td>1127000.0</td>
      <td>73000.0</td>
      <td>6.48</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Yogyakarta</td>
      <td>2015</td>
      <td>1302500</td>
      <td>1173300.0</td>
      <td>129200.0</td>
      <td>11.01</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Kulonprogo</td>
      <td>2016</td>
      <td>1268870</td>
      <td>1138000.0</td>
      <td>130870.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Bantul</td>
      <td>2016</td>
      <td>1297700</td>
      <td>1163800.0</td>
      <td>133900.0</td>
      <td>11.51</td>
    </tr>
    <tr>
      <th>17</th>
      <td>Gunungkidul</td>
      <td>2016</td>
      <td>1235700</td>
      <td>1108249.0</td>
      <td>127451.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>18</th>
      <td>Sleman</td>
      <td>2016</td>
      <td>1338000</td>
      <td>1200000.0</td>
      <td>138000.0</td>
      <td>11.50</td>
    </tr>
    <tr>
      <th>19</th>
      <td>Yogyakarta</td>
      <td>2016</td>
      <td>1452400</td>
      <td>1302500.0</td>
      <td>149900.0</td>
      <td>11.51</td>
    </tr>
    <tr>
      <th>20</th>
      <td>Kulonprogo</td>
      <td>2017</td>
      <td>1373600</td>
      <td>1268870.0</td>
      <td>104730.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>21</th>
      <td>Bantul</td>
      <td>2017</td>
      <td>1404760</td>
      <td>1297700.0</td>
      <td>107060.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>22</th>
      <td>Gunungkidul</td>
      <td>2017</td>
      <td>1337650</td>
      <td>1235700.0</td>
      <td>101950.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>23</th>
      <td>Sleman</td>
      <td>2017</td>
      <td>1448385</td>
      <td>1338000.0</td>
      <td>110385.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>24</th>
      <td>Yogyakarta</td>
      <td>2017</td>
      <td>1572200</td>
      <td>1452400.0</td>
      <td>119800.0</td>
      <td>8.25</td>
    </tr>
    <tr>
      <th>25</th>
      <td>Kulonprogo</td>
      <td>2018</td>
      <td>1493250</td>
      <td>1373600.0</td>
      <td>119650.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>26</th>
      <td>Bantul</td>
      <td>2018</td>
      <td>1572150</td>
      <td>1404760.0</td>
      <td>167390.0</td>
      <td>11.92</td>
    </tr>
    <tr>
      <th>27</th>
      <td>Gunungkidul</td>
      <td>2018</td>
      <td>1454200</td>
      <td>1337650.0</td>
      <td>116550.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>28</th>
      <td>Sleman</td>
      <td>2018</td>
      <td>1574550</td>
      <td>1448385.0</td>
      <td>126165.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>29</th>
      <td>Yogyakarta</td>
      <td>2018</td>
      <td>1709150</td>
      <td>1572200.0</td>
      <td>136950.0</td>
      <td>8.71</td>
    </tr>
    <tr>
      <th>30</th>
      <td>Kulonprogo</td>
      <td>2019</td>
      <td>1613200</td>
      <td>1493250.0</td>
      <td>119950.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>31</th>
      <td>Bantul</td>
      <td>2019</td>
      <td>1649800</td>
      <td>1572150.0</td>
      <td>77650.0</td>
      <td>4.94</td>
    </tr>
    <tr>
      <th>32</th>
      <td>Gunungkidul</td>
      <td>2019</td>
      <td>1571000</td>
      <td>1454200.0</td>
      <td>116800.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>33</th>
      <td>Sleman</td>
      <td>2019</td>
      <td>1701000</td>
      <td>1574550.0</td>
      <td>126450.0</td>
      <td>8.03</td>
    </tr>
    <tr>
      <th>34</th>
      <td>Yogyakarta</td>
      <td>2019</td>
      <td>1848400</td>
      <td>1709150.0</td>
      <td>139250.0</td>
      <td>8.15</td>
    </tr>
    <tr>
      <th>35</th>
      <td>Kulonprogo</td>
      <td>2020</td>
      <td>1750500</td>
      <td>1613200.0</td>
      <td>137300.0</td>
      <td>8.51</td>
    </tr>
    <tr>
      <th>36</th>
      <td>Bantul</td>
      <td>2020</td>
      <td>1790500</td>
      <td>1649800.0</td>
      <td>140700.0</td>
      <td>8.53</td>
    </tr>
    <tr>
      <th>37</th>
      <td>Gunungkidul</td>
      <td>2020</td>
      <td>1705000</td>
      <td>1571000.0</td>
      <td>134000.0</td>
      <td>8.53</td>
    </tr>
    <tr>
      <th>38</th>
      <td>Sleman</td>
      <td>2020</td>
      <td>1846000</td>
      <td>1701000.0</td>
      <td>145000.0</td>
      <td>8.52</td>
    </tr>
    <tr>
      <th>39</th>
      <td>Yogyakarta</td>
      <td>2020</td>
      <td>2004000</td>
      <td>1848400.0</td>
      <td>155600.0</td>
      <td>8.42</td>
    </tr>
    <tr>
      <th>40</th>
      <td>Kulonprogo</td>
      <td>2021</td>
      <td>1770000</td>
      <td>1750500.0</td>
      <td>19500.0</td>
      <td>1.11</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Bantul</td>
      <td>2021</td>
      <td>1805000</td>
      <td>1790500.0</td>
      <td>14500.0</td>
      <td>0.81</td>
    </tr>
    <tr>
      <th>42</th>
      <td>Gunungkidul</td>
      <td>2021</td>
      <td>1842460</td>
      <td>1705000.0</td>
      <td>137460.0</td>
      <td>8.06</td>
    </tr>
    <tr>
      <th>43</th>
      <td>Sleman</td>
      <td>2021</td>
      <td>1903500</td>
      <td>1846000.0</td>
      <td>57500.0</td>
      <td>3.11</td>
    </tr>
    <tr>
      <th>44</th>
      <td>Yogyakarta</td>
      <td>2021</td>
      <td>2069530</td>
      <td>2004000.0</td>
      <td>65530.0</td>
      <td>3.27</td>
    </tr>
    <tr>
      <th>45</th>
      <td>Kulonprogo</td>
      <td>2022</td>
      <td>1904275</td>
      <td>1770000.0</td>
      <td>134275.0</td>
      <td>7.59</td>
    </tr>
    <tr>
      <th>46</th>
      <td>Bantul</td>
      <td>2022</td>
      <td>1916848</td>
      <td>1805000.0</td>
      <td>111848.0</td>
      <td>6.20</td>
    </tr>
    <tr>
      <th>47</th>
      <td>Gunungkidul</td>
      <td>2022</td>
      <td>1900000</td>
      <td>1842460.0</td>
      <td>57540.0</td>
      <td>3.12</td>
    </tr>
    <tr>
      <th>48</th>
      <td>Sleman</td>
      <td>2022</td>
      <td>2001000</td>
      <td>1903500.0</td>
      <td>97500.0</td>
      <td>5.12</td>
    </tr>
    <tr>
      <th>49</th>
      <td>Yogyakarta</td>
      <td>2022</td>
      <td>2153970</td>
      <td>2069530.0</td>
      <td>84440.0</td>
      <td>4.08</td>
    </tr>
  </tbody>
</table>
</div>

```python
data_sleman = df.query('kabupaten == "Sleman"')
sns.set_style('darkgrid')
sns.lineplot(data=data_sleman, x="tahun", y='upah_minimum')
```

    <AxesSubplot: xlabel='tahun', ylabel='upah_minimum'>

![png](https://drive.google.com/uc?export=view&id=1vOs-T9GsoCWwNVCN1whCMMwuYxIWpwPf)

```python
kabupaten_pivot = df.pivot('tahun', 'kabupaten', 'upah_minimum')
kabupaten_pivot.head()
```

    /var/folders/l5/0j6855hs3d98m4lrr_mnkbjc0000gn/T/ipykernel_3423/163442775.py:1: FutureWarning: In a future version of pandas all arguments of DataFrame.pivot will be keyword-only.
      kabupaten_pivot = df.pivot('tahun', 'kabupaten', 'upah_minimum')

<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: middle;">
      <th>kabupaten</th>
      <th>Bantul</th>
      <th>Gunungkidul</th>
      <th>Kulonprogo</th>
      <th>Sleman</th>
      <th>Yogyakarta</th>
    </tr>
    <tr>
      <th>tahun</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2013</th>
      <td>993484</td>
      <td>947114</td>
      <td>954339</td>
      <td>1026181</td>
      <td>1065247</td>
    </tr>
    <tr>
      <th>2014</th>
      <td>1125500</td>
      <td>988500</td>
      <td>1069000</td>
      <td>1127000</td>
      <td>1173300</td>
    </tr>
    <tr>
      <th>2015</th>
      <td>1163800</td>
      <td>1108249</td>
      <td>1138000</td>
      <td>1200000</td>
      <td>1302500</td>
    </tr>
    <tr>
      <th>2016</th>
      <td>1297700</td>
      <td>1235700</td>
      <td>1268870</td>
      <td>1338000</td>
      <td>1452400</td>
    </tr>
    <tr>
      <th>2017</th>
      <td>1404760</td>
      <td>1337650</td>
      <td>1373600</td>
      <td>1448385</td>
      <td>1572200</td>
    </tr>
  </tbody>
</table>
</div>

```python
sns.lineplot(data=kabupaten_pivot)
```

    <AxesSubplot: xlabel='tahun'>

![png](https://drive.google.com/uc?export=view&id=1QGpFw_0H8Oden5QIPTtLn5VVQKa_J2ag)

### Visualization Minimum wage data for district in DI Yogyakarta with Linechart

```python
fig, ax = plt.subplots(figsize = (10,5),)
sns.lineplot(data=df, x="tahun", y='upah_minimum', hue='kabupaten')
plt.show()
```

![png](https://drive.google.com/uc?export=view&id=1pZ9hwVubO6guz3JSIyq9RAh_7cZzFVdD)

Based on linechart above, it seems Yogyakarta District minimum wage always in rank 1, it is because yogyakarta district is the main capital of DI Yogyakarta

i feel like graph from seaborn is not very interactive, lets changed it with plotly

```python
import plotly.graph_objects as go
import plotly.express as px
```

```python
fig = px.line(
        df, x='tahun', y='upah_minimum', color='kabupaten',
        title=f'Kenaikan upah_minimum kabupaten di Provinsi DI Yogyakarta tahun 2013-2022')


fig.update_layout(title_x=0.5)

# Format the y-axis tick labels
fig.update_layout(yaxis=dict(tickformat=',.0f', tickprefix='Rp ', title='Kenaikan Upah'))


# Display the chart
fig.show()
```

```python

```

The visualization looks good and also very interactive when hover to the graph, now lets make cloroethmap for this data

```python
import json

with open('../data/processed/yogyakarta.geojson') as f:
    district = json.load(f)

def choropleth(year):
    """
        select year range 2013-2022, to create visualization on chloropleth map based on year.
    """
    fig = px.choropleth(
                df[df['tahun']== year], geojson=district, color="upah_minimum",
                locations="kabupaten", featureidkey="properties.region",
                hover_data={"kabupaten":True, "upah_minimum":':,'}
                )

    fig.add_scattergeo(
        geojson=district, locations=df['kabupaten'], text=df["kabupaten"],
        featureidkey="properties.region", mode='text', hoverinfo='none', textfont=dict(size=15, color="black", family="Arial")
        )

    fig.update_geos(fitbounds="locations", visible=False)


    fig.update_layout(
            title=f"<b>upah_minimum kabupaten di Provinsi DI Yogyakarta<br>tahun {year}</br>",
            title_x=0.5, title_y=0.95, title_font_size=22, title_font_family="Arial",
            autosize=False, margin={"r":0,"t":0,"l":0,"b":0}, width=1080, height=720, template='simple_white'
            )

    return fig.show()


tahun_2013 = choropleth(2013)
tahun_2013

    # Create cloroeth-map


```

```python
def kabupaten_history_line(df):
    processed_df = df
    processed_df.reset_index(drop=True, inplace = True)
    kab_name = processed_df['kabupaten'][0]
    fig = px.line(
        df, x='tahun', y='different_amount_yearly',
        title=f'Kenaikan upah_minimum Provinsi (UMP) tahunan<br>{kab_name} 2001-2022', markers=True

    )

    fig.update_layout(
            title_x=0.5, title_y=0.95, title_font_size=22, title_font_family="Arial",
            autosize=False, margin={"r":0,"t":100,"l":0,"b":0}, template='simple_white'
            )

    return fig.show()

data_sleman = df[df["kabupaten"].str.contains("Sleman")]

line_chart_sleman = kabupaten_history_line(data_sleman)
line_chart_sleman
```

## Build dashboard with streamlit!

```python
#app.py
import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import json

#Load Data
df = pd.read_csv('data/processed/DI-Yogyakarta Minimum Wage.csv')
with open('data/processed/yogyakarta.geojson') as f:
    district = json.load(f)



#Streamlit App
st.title('Visualisasi Sederhana UMP Kabupaten di Provinsi DI Yogyakarta')
tahun = list(df['tahun'].unique())
choice = st.selectbox('Pilih Tahun!', options=tahun)
df_choice = df[df['tahun']==choice]

st.header(f":money_with_wings: Upah Minimum Kabupaten di Provinsi DI Yogyakarta Tahun {choice}")
#Geographic Map
fig = go.Figure(
    go.Choroplethmapbox(
        geojson=district,
        locations=df_choice.kabupaten,
        featureidkey="properties.region",
        colorscale="Bluered",
        z=df_choice.upah_minimum,
        marker_opacity=0.5,
        marker_line_width=0,
        colorbar={"orientation": "h", "tickformat":",.0f", "tickprefix":"Rp "},
    )
)


fig.update_geos(fitbounds='locations', visible=False)
fig.update_layout(
    mapbox_center = {'lat':-7.871236995632798, 'lon':110.42614574441643},
    mapbox_style="carto-positron",
    mapbox_zoom=9,
    width=700,
    height=600,

)
fig.update_layout(margin={"r": 0, "t": 0, "l": 0, "b": 0})
st.plotly_chart(fig)

fig = px.line(
    df, x='tahun', y='upah_minimum', color='kabupaten', markers=True, title=f'Riwayat Kenaikan Upah Minimum Provinsi DI-Yogyakarta (UMP) Tahun <br> 2012-2022'
)
st.plotly_chart(fig)

fig = px.line(
    df, x='tahun', y='different_amount_yearly', color='kabupaten', markers=True, title=f'Riwayat Jumlah Perbedaan Kenaikan Upah Minimum Provinsi DI-Yogyakarta (UMP) Tahun <br> 2012-2022'
)
st.plotly_chart(fig)

```

Once your Streamlit app is built, you can run it by typing the command `streamlit run app.py` in your terminal. The resulting dashboard interface will appear as follows:

![png](https://drive.google.com/uc?export=view&id=1s4e7Fvv4ef7MfcI7aLhdvNmVF2SPcv2M)

## Tableau dashboard

I apologize, but I am unable to provide you with a tutorial on building a dashboard in Tableau because there are numerous tutorials available on the internet :)). And IMO, building dashboard with the data that we've been **clean** before in tableau is more easier than building dashboard in streamlit.

  <iframe class="responsive-iframe" src="https://public.tableau.com/views/VisualisasiUMPProvinsiDIY/VisualisasiUMPProvinsiDaerahIstimewaYogyakarta?:showVizHome=no&:embed=true" width="645" height="945" ></iframe>
