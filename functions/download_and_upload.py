from firebase_functions import logger
from firebase_admin import storage as fb_storage
import requests
import os
def download_and_upload(arxiv_id):
    logger.log(f"{arxiv_id}: download_and_upload called")

    # Set the storage path
    storage_path = f"{arxiv_id}/article.pdf"

    # Check storage if arxiv_id/article.pdf exists. If it does, log and abort
    bucket = fb_storage.bucket()
    blob = bucket.blob(storage_path)
    exists = blob.exists()
    if exists:
        logger.log(f"{arxiv_id}: article.pdf already exists. Aborting operation.")
        return

    # Download the content from the URL
    url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
    response = requests.get(url)
    logger.log(f"{arxiv_id}: status code: {response.status_code}")
    content = response.content


    logger.log(f"{arxiv_id}: uploading article.pdf")

    blob = bucket.blob(storage_path)
    blob.upload_from_string(content)
    logger.log(f"{arxiv_id}: successfully completed download_and_upload")
