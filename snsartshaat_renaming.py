import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
docs = db.collection(u'snsartshaatProducts').stream()

for doc in docs:
    docs = db.collection(u'snsnartshaatProducts').document(doc.id).set(doc.to_dict())
    print(f'Done duplicating {doc.id}')