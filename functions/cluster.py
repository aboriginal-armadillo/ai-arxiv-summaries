
from firebase_admin import storage
from firebase_functions import logger
from sklearn.cluster import KMeans
import numpy as np
import joblib
import os

def train_clusters_and_upload(db):
    logger.log("retraining clusters...")
    # Fetch embeddings from Firestore
    model_blob_name='kmeans_model.joblib'
    arxiv_ref = db.collection('arxiv')
    query = arxiv_ref
    documents = query.stream()

    doc_ids = []
    embeddings = []
    logger.log("fetching embeddings...")
    for doc in documents:
        doc_data = doc.to_dict()
        if 'emb_32d' in doc_data and len(doc_data['emb_32d']) == 32:
            doc_ids.append(doc.id)
            embeddings.append(doc_data['emb_32d'])
    logger.log(f"found {len(embeddings)} embeddings")
    X = np.array(embeddings)

    # Train K-Means model
    kmeans = KMeans(n_clusters=15, random_state=0).fit(X)
    logger.log("training complete, updating documents")
    for doc_id, cluster_label in zip(doc_ids, kmeans.labels_):
        db.collection('arxiv').document(doc_id).update({'cluster': cluster_label.item()})
    logger.log("updating complete, saving model...")
    # Save model to a local file temporarily
    temp_model_path = '/tmp/kmeans_model.joblib'
    joblib.dump(kmeans, temp_model_path)

    # Upload the model to Google Cloud Storage
    bucket = storage.bucket()
    blob = bucket.blob(model_blob_name)
    blob.upload_from_filename(temp_model_path)
    logger.log("all done")


def predict_cluster(embedding):
    temp_model_path = '/tmp/kmeans_model.joblib'
    logger.log("predicting cluster...")
    if not os.path.exists(temp_model_path):
        logger.log("downloading model from GCS...")
        # Download the model from Google Cloud Storage
        bucket = storage.bucket()
        model_blob_name='kmeans_model.joblib'
        blob = bucket.blob(model_blob_name)
        blob.download_to_filename(temp_model_path)
    else:
        logger.log("model already exists locally")
    # Load the model
    logger.log('loading model...')
    kmeans = joblib.load(temp_model_path)

    # Predict the cluster for the given embedding
    embedding = np.array([embedding])
    cluster_label = kmeans.predict(embedding)

    return cluster_label[0].item()

