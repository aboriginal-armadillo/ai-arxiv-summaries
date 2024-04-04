

## ToDo

#### Functions
- [x] f1(arxiv_id) -> downloads pdf to storage [link](functions/download_and_upload.py)
- [x] f2(cron) nightly job to read RSS feeds from arxiv and run f1 on each IFF id doesn't already exist - create document in collection, creates folder with initial pdf
- [x] f3(on_upload) onUpload to storage -  write text w/o references or appendicies to s3, summarize document, write summary to firestore
- [ ] f4(cron) nightly job to read hf papers - annotate documents in firestore if item is hf-paper
- [ ] f5(docId) - generate embedding from abstract 
- [ ] f6(cron) - run clustering algorithm of last N documents - then do centroid analysis to label clusters - write results to /clusters collection date document (so you can go back in time and see other maps) - this document will feed visualization so include links or IDs to summaries
- [ ] f7(cron) PCA on all embeddings to reduce from 1528 (or however many) dimensions to 3. For rendering 

#### WebUI
- [ ] Home - visualization and list of papers sorted from newest to oldest
- [ ] Summary - Where the summary will be rendered
- [ ] Map Component
- [ ] PaperList Component

## Documentation

- [ ] Docs on setting up Firebase project
- [ ] Docs on Cloning this project then rigging it to firebase project in last step
