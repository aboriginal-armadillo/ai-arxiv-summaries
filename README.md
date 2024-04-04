url: https://ai-arxiv-summaries.firebaseapp.com/

## ToDo

#### Functions
- [ ] `clusterAnalysis` Pull all docs, sort by cluster, find unique keywords for that cluster, save to firestore, load as key
  - [ ] add cluster label to modal
- [ ] `readHF` Read from HuggingFace, for each paper set `isHF` to true in firestore, summarize paper (fn exists)
   - [ ] if paper has summary make point larger, and add summary view to modal
  
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
