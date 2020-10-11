import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)

auth_emails = []
db_emails = []
f_emails = []

for user in auth.list_users().iterate_all():
    auth_emails.append({'uid': user.uid, 'email': user.email})

db = firestore.client()

docs = db.collection(u'publicUsers').stream()
for doc in docs:
    db_emails.append({'uid':doc.id, 'email': doc.to_dict()['email'], 'db': 'public'})
docs = db.collection(u'schoolUsers').stream()
for doc in docs:
    db_emails.append({'uid':doc.id, 'email': doc.to_dict()['email'], 'db': 'school'})

print("\nauth emails not in db")
for i in auth_emails:
    db_email_exists = False
    for j in db_emails:
        if i['uid'] == j['uid']: 
            db_email_exists = True
            break
    if not db_email_exists: 
        # auth.delete_user(i["uid"])
        print(f'{i["uid"]} {i["email"]}')

print("\ndb emails not in auth")
for i in db_emails:
    auth_email_exists = False
    for j in auth_emails:
        if i['uid'] == j['uid']: 
            auth_email_exists = True
            break
    if not auth_email_exists: 
        print(f'{i["uid"]} {i["db"]} {i["email"]}')

        # print("")
        # print("")
        # print(f'{i["uid"]} {i["db"]} {i["email"]}')
        # print("")
        # print(db.collection(f'{i["db"]}Users').document(i["uid"]).get().to_dict())

print("")