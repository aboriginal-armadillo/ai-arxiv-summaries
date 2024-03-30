# from firebase_functions import logger

from firebase_functions import logger
from download_and_upload import download_and_upload

import feedparser



def read_arxiv_rss(feed_url):
    """
    Reads and parses an RSS feed from arXiv.

    Args:
    - feed_url (str): The URL of the RSS feed.

    Returns:
    - A list of dictionaries, each representing an entry in the feed.
    """
    # Parse the RSS feed
    feed = feedparser.parse(feed_url)

    # Extract entries
    entries = []
    for entry in feed.entries:
        entry_data = {
            'title': entry.title,
            'link': entry.link,
            'author': entry.author,
            'summary': entry.summary
        }
        entries.append(entry_data)

    return entries
def scrape_rss(url, db):
    logger.log(f"scrape_rss({url})")
    enteries = read_arxiv_rss(url)
    for e in enteries:
        arxiv_id = e['link'].split('/')[-1]
        individual_article_local(arxiv_id, db, e)


def individual_article_local(arxiv_id, db, e= {}):
    logger.log(f"{arxiv_id}: Processing...")
    doc_ref = db.collection('arxiv').document(arxiv_id)
    doc_ref.set({
        "status": "Downloading...",
        "title": e.get('title', ""),
        "author": e.get('author',""),
    })
    download_and_upload(arxiv_id)

