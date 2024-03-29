from firebase_functions import logger
from firebase_admin import initialize_app, firestore

from download_and_upload import download_and_upload

import feedparser

initialize_app()
db = firestore.client()

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
def scrape_rss(url):
    logger.log(f"scrape_rss({url})")
    enteries = read_arxiv_rss(url)
    for e in enteries:
        arxiv_id = e['link'].split('/')[-1]
        logger.log(f"{arxiv_id}: Processing...")
        doc_ref = db.collection('content').document(arxiv_id)
        doc_ref.set({
            "status": "Downloading...",
            "title": e['title'],
            "author": e['author'],
        })
        download_and_upload(arxiv_id)


