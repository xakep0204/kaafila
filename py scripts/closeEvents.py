import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

with open('routes/eventRoutes.json', errors='ignore') as f: data = json.load(f)

docs = db.collection(u'publicUsers').stream()
for event in data:
    for subevent in data[event]:
        if not (subevent in ["title", "name", "cssID", "headerFont", "eventCategories", "navID"]):
            doc_ref = db.collection(u'events').document(subevent)
            doc = doc_ref.get()
            if doc.exists: doc_ref.update({'closed': True})
            else: doc_ref.set({'closed': True})
            print(f'Closed {subevent}')