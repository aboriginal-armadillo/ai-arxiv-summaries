
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from firebase_functions import logger
from time import sleep
import uuid

from scrape_rss import individual_article_local


def extract_links(url):
    """
    Extracts links from a given URL using requests and BeautifulSoup.

    Args:
        url: The URL to extract links from.

    Returns:
        A list of extracted links.
    """

    # Use requests to fetch the webpage content
    response = requests.get(url)

    # Check for successful response
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all anchor tags (`<a>`) that contain an `href` attribute
        links = soup.find_all('a', href=True)

        # Extract and return only the `href` values
        return [link['href'] for link in links]
    else:
        print(f"Error fetching URL: {url} - Status code: {response.status_code}")
        return []


def new_hf_papers(db):
    logger.log(f"New HF Paper Feed Triggered.")
    # Extract task-specific data from the payload
    # (e.g., using data["attributes"]["some_key"])

    # Your function logic here
    # Replace with your desired URL
    yesterday = datetime.today() - timedelta(days=1)
    url = "https://huggingface.co/papers?date=" + yesterday.strftime("%Y-%m-%d")

    logger.log(f"Checking url: {url}")
    extracted_links = extract_links(url)
    logger.log(f"Found {len(extracted_links)} links")
    extracted_links2 = [l.split("#")[0] for l in extracted_links if l.startswith('/papers/')]

    extracted_links2 = list(set(extracted_links2))
    logger.log(f"Found {len(extracted_links2)} real links")
    if extracted_links2:
        for i, link in enumerate(extracted_links2):
            paper_link = [l for l in extract_links('https://huggingface.co' + link) if l.startswith('https://arxiv.org/pdf')][0]
            arxiv_id = paper_link.split('/')[-1].split('.pdf')[0]
            individual_article_local(arxiv_id, db)
            sleep(1)
    else:
        print("No links found on the provided URL.")

    return None
