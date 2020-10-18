import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
mainDB = db.collection(u'votes').document('master').get().to_dict()

print(mainDB)