import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
mainDB = {}

docs = db.collection(u'entries').stream()

for doc in docs:
    mainDB[doc.id] = False

print(mainDB)

doc_ref = db.collection(u'votes').document('master').set(mainDB)