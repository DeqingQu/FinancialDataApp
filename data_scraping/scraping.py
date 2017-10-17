import requests
from time import sleep
from bs4 import BeautifulSoup
import json
import mysql.connector

BASE_URL = "https://finance.google.com"
ticker_symbol = "NASDAQ:TSLA"#"HKG:0966"

related_companies = []


class Company:
    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol

    def print_company(self):
        print("name : {}, symbol : {}".format(self.name, self.symbol))


#   retrieve data from URL
def retrieve(url: str):
    #   retrieves content at the specified url
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


#   database operation: update 'related_companies' in table 'company'
def update_related_companies_in_db(symbol: str, companies: list):

    symbols = "["
    for related_company in companies:
        symbols += "\"{}\",".format(related_company.symbol)
    symbols = symbols[:len(symbols)-1]
    symbols += "]"

    connection = mysql.connector.connect(host="localhost", port=3306, user="demo", passwd="demo", db="semdemo")
    db = connection.cursor(prepared=True)
    db.execute("UPDATE companies SET related_companies=? WHERE ticker_symbol=?", [symbols, ticker_symbol])
    connection.commit()  # required, as mysql generally doesn't autocommit
    connection.close()

    print("Update related companies successfully")


#   database operation: insert new companies in table 'company'
def insert_related_companies_in_db(companies: list):

    connection = mysql.connector.connect(host="localhost", port=3306, user="demo", passwd="demo", db="semdemo")
    db = connection.cursor(prepared=True)

    for company in companies:
        db.execute("INSERT INTO companies(company_name, ticker_symbol) VALUES(?,?)", [company.name, company.symbol])
        connection.commit()  # required, as mysql generally doesn't autocommit

    connection.close()

    print("Insert related companies successfully")


def print_related_companies(companies: list):
    for company in companies:
        company.print_company()


related_companies = find_related_companies(ticker_symbol, BASE_URL)
print_related_companies(related_companies)
update_related_companies_in_db(ticker_symbol, related_companies)
insert_related_companies_in_db(related_companies)
