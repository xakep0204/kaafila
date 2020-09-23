import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
docs = db.collection(u'publicUsers').stream()

for doc in docs:
    email = doc.to_dict()['email']
    print(f'{email}')