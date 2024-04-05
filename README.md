url: https://ai-arxiv-summaries.firebaseapp.com/

## ToDo

#### Functions
- [ ] `clusterAnalysis` Pull all docs, sort by cluster, find unique keywords for that cluster, save to firestore, load as key
  - [ ] add cluster label to modal
- [x] `readHF` Read from HuggingFace, for each paper set `isHF` to true in firestore, summarize paper (fn exists)
   - [x] if paper has summary make point larger, and add summary view to modal
_ [x] only get the 32d embeddings for the abstracts (or maybe higher)
  - [x] do (and save) a PCA for 3d and 2d (openAI returns unit vectors which don't map well)

#### WebUI
- [ ] Navbar
- [ ] Footer
- [ ] 2dmap Component
- [ ] PaperList Component
- [ ] selector switches
  - [ ] enable/disable clusters
  - [ ] change cluster colors
  - [ ] enable/disable papers
  - [ ] change bkg colors
  
## Documentation for cloning to other stuff

- [ ] Docs on setting up Firebase project
- [ ] Docs on Cloning this project then rigging it to firebase project in last step
