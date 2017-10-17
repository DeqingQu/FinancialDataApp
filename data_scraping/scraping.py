import requests
from time import sleep
from bs4 import BeautifulSoup
from datetime import datetime
import json

BASE_URL = "https://finance.google.com"

ticker_symbol = "HKG:0966"
related_companies = []


class Company:
    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol


#   retrieve data from URL
def retrieve(url: str):
    """retrieves content at the specified url"""
    print("*", url)
    sleep(1)  # *never* web scrape faster than 1 request per second
    r = requests.get(url, verify=False)  # get the HTML; ignore SSL errors (present on this particular site)
    soup = BeautifulSoup(r.text, "lxml")  # parse the HTML
    return soup


#   find related companies from Google Financial
def find_related_companies(symbol: str, base_url: str):
    companies = []
    url = base_url + '/finance?q=' + symbol
    #   get the link to related companies
    soup = retrieve(url)
    #   li.fjfe-nav-sub
    for li in soup.find_all('li', {"class": "fjfe-nav-sub"}):
        if li.text == "Related companies":
            related_companies_url = base_url + li.findChildren('a')[0].get('href')
    #   get the content of related companies from the new url
    soup = retrieve(related_companies_url)
    for script in soup.find_all('script'):
        if script.text.find('google.finance.data') > 0:
            # print(script.text)
            index_start = script.text.find('google.finance.data')
            index_end = script.text.find('google.finance.data.numberFormat')
            result = script.text[index_start + len('google.finance.data = '):index_end-2]
            json_result = json.loads(result)
            for related_company in json_result['company']['related']['rows']:
                company_name = related_company['values'][1]
                company_symbol = "{}:{}".format(related_company['values'][8], related_company['values'][0])
                if company_symbol != symbol:
                    companies.append(Company(company_name, company_symbol))
    return companies


related_companies = find_related_companies(ticker_symbol, BASE_URL)
for company in related_companies:
    print("name : {}, symbol : {}".format(company.name, company.symbol))

