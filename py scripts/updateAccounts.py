import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)

auth_accounts = {}

for user in auth.list_users().iterate_all():
    auth_accounts[user.uid] = user

db = firestore.client()

docs = db.collection(u'publicUsers').stream()
for doc in docs:
    print({'name': auth_accounts[doc.id].display_name, 'provider': auth_accounts[doc.id].provider_data[0].provider_id})
    db.collection(u'publicUsers').document(doc.id).update({'name': auth_accounts[doc.id].display_name, 'provider': auth_accounts[doc.id].provider_data[0].provider_id})

print()
docs = db.collection(u'schoolUsers').stream()
for doc in docs:
    print({'name': auth_accounts[doc.id].display_name, 'provider': auth_accounts[doc.id].provider_data[0].provider_id})
    db.collection(u'schoolUsers').document(doc.id).update({'provider': auth_accounts[doc.id].provider_data[0].provider_id})