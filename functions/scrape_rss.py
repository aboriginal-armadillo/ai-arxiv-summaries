# from firebase_functions import logger

from firebase_functions import logger
from download_and_upload import download_and_upload
from openai import OpenAI
from cluster import predict_cluster
import feedparser

def read_arxiv_rss(feed_url, db):
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
        create_firestore_entry(db, entry)

    return entries

def create_firestore_entry(db, e):
    """
    Creates a new entry in Firestore for a given arXiv article.

    Args:
    - arxiv_id (str): The arXiv ID of the article.
    - db (firestore.Client): The Firestore client.
    - e (dict): A dictionary containing the article metadata.

    Returns:
    - None
    """
    arxiv_id = e['link'].split('abs/')[-1]
    # Create a reference to the document
    doc_ref = db.collection('arxiv').document(arxiv_id)
    if doc_ref.get().exists:
        logger.log(f"Document {arxiv_id} already exists")
        return None
    logger.log(f"Creating embedding for document {arxiv_id}")
    client = OpenAI()
    response3d = client.embeddings.create(
        model="text-embedding-3-small",
        input=e['summary'],
        encoding_format="float",
        dimensions = 3
    )
    response2d = client.embeddings.create(
        model="text-embedding-3-small",
        input=e['summary'],
        encoding_format="float",
        dimensions = 2
    )
    response32d = client.embeddings.create(
        model="text-embedding-3-small",
        input=e['summary'],
        encoding_format="float",
        dimensions = 32
    )
    logger.log(f"Creating document {arxiv_id}")
    # Set the document data
    doc_ref.set({
        'title': e.get('title', ''),
        'author': e.get('author', ''),
        'summary': e.get('summary', ''),
        'emb_2d': response2d.data[0].embedding,
        'emb_3d': response3d.data[0].embedding,
        'emb_32d': response32d.data[0].embedding,
        'cluster': predict_cluster(response32d.data[0].embedding),
    })

def scrape_rss(url, db):
    logger.log(f"scrape_rss({url})")
    read_arxiv_rss(url, db)


def individual_article_local(arxiv_id, db, e= {}):
    logger.log(f"{arxiv_id}: Processing...")
    download_and_upload(arxiv_id)


