
from firebase_admin import storage
from firebase_functions import logger
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

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
    pca_3d = PCA(n_components=3)
    pca_2d = PCA(n_components=2)
    embeddings_3d = pca_3d.fit_transform(X)
    embeddings_2d = pca_2d.fit_transform(X)
    logger.log("training complete, updating documents")
    for doc_id, cluster_label, emb_3d, emb_2d in zip(doc_ids, kmeans.labels_, embeddings_3d, embeddings_2d):
        db.collection('arxiv').document(doc_id).update({
            'cluster': cluster_label.item(),
            '3d_emb': emb_3d.tolist(),
            '2d_emb': emb_2d.tolist()
        })

    logger.log("updating complete, saving model...")
    # Save model to a local file temporarily
    temp_model_path = '/tmp/kmeans_model.joblib'
    joblib.dump(kmeans, temp_model_path)

    joblib.dump(pca_3d, '/tmp/pca_3d.joblib')
    joblib.dump(pca_2d, '/tmp/pca_2d.joblib')

    # Upload the model to Google Cloud Storage
    bucket = storage.bucket()
    blob = bucket.blob(model_blob_name)
    blob.upload_from_filename(temp_model_path)
    blob.upload_from_filename('/tmp/pca_3d.joblib')
    blob.upload_from_filename('/tmp/pca_2d.joblib')
    logger.log("all done")


def predict_cluster(embedding):
    temp_model_path = '/tmp/kmeans_model.joblib'
    temp_2dpca_path = f'/tmp/pca_2d.joblib'
    temp_3dpca_path = f'/tmp/pca_3d.joblib'

    logger.log("predicting cluster...")
    for loop_path in [temp_model_path, temp_2dpca_path, temp_3dpca_path]:
        if not os.path.exists(loop_path):
            model_blob_name = loop_path.split('/')[-1]
            logger.log(f"downloading model {loop_path} from GCS...")
            # Download the model from Google Cloud Storage
            bucket = storage.bucket()
            blob = bucket.blob(model_blob_name)
            blob.download_to_filename(loop_path)
        else:
            logger.log("model already exists locally")
    # Load the model
    logger.log('loading model...')
    kmeans = joblib.load(temp_model_path)
    pca2d = joblib.load(temp_2dpca_path)
    pca3d = joblib.load(temp_3dpca_path)

    # Predict the cluster for the given embedding
    embedding = np.array([embedding])
    cluster_label = kmeans.predict(embedding)
    embedding_reduced_2d = pca2d.transform(np.array([embedding]))
    embedding_reduced_3d = pca3d.transform(np.array([embedding]))

    return {"cluster": cluster_label[0].item(), "emb_2d": embedding_reduced_2d.tolist(), "emb_3d": embedding_reduced_3d.tolist()}

