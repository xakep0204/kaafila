import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

docs = db.collection(u'votes')
votes_main = {}
c = 0
  
print()
for doc in docs.stream():
  if doc.id != 'master': 
    c += 1
    for subevent in doc.to_dict():
      if subevent != 'name': 
        if not (subevent in votes_main.keys()): votes_main[subevent] = {}
        for vote in doc.to_dict()[subevent]:
          vote = vote.replace(',', '')
          if (vote in votes_main[subevent]): votes_main[subevent][vote] += 1
          else: votes_main[subevent][vote] = 1

for subevent in votes_main:
  total_votes = 0
  csv_file = open(f"votes/{subevent}.csv", "a")
  csv_file.write("Entry,Votes,Vote Percentage")
  for vote in votes_main[subevent]:
    total_votes += votes_main[subevent][vote]
  for vote in votes_main[subevent]:
    csv_file.write(f"\n{vote},{votes_main[subevent][vote]},{round(votes_main[subevent][vote]/total_votes, 4)}")
  csv_file.close() 