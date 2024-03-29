import fitz  # PyMuPDF
import openai
from firebase_functions import logger
from time import sleep
def summarize(text, long_text=False):
    model="gpt-3.5-turbo"
    if long_text:
        model="gpt-3.5-turbo-16k"
    print(f"Using Model: {model}")
    sleep(0.25)
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "Summarize content you are provided in great "
                           "detail (at least 600 words, up to 2000 words). Do not insert knowledge beyond the document into the summary, and do not name the author or title of the work. Your task is to summarize the document, not continue it. Some documents will end mid-sentance, still summarize the document."
            },
            {
                "role": "user",
                "content": text
            }])
    return completion.choices[0].message.content
