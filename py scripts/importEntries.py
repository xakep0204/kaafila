import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

with open('entries.json', errors='ignore') as f: data = json.load(f)

for event in data:
  for subevent in data[event]:
    print()
    doc_ref = db.collection(u'entries').document(subevent)
    doc_ref.set(data[event][subevent])
    print(data[event][subevent])
    print(f'\nCompleted {subevent}\n\n')