# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`


from firebase_functions import storage_fn, options, https_fn, logger, scheduler_fn
from firebase_admin import initialize_app
from firebase_functions import logger

from scrape_rss import scrape_rss


# initialize_app()
#
#
# @https_fn.on_request()
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     return https_fn.Response("Hello world!")

# @scheduler_fn.on_schedule(schedule="every day 00:33", memory=options.MemoryOption.MB_512)
# def scrape_rss_cron(event: scheduler_fn.ScheduledEvent):
#     scrape_rss("https://rss.arxiv.org/rss/cs.ai+cs.cl+cs.cv+cs.lg")
