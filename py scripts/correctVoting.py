import json, re
import firebase_admin
from firebase_admin import credentials, firestore, auth
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
corrections = {
  "Debroop Roy Choudhary - Khaitan Public School": "Debroop Roy Choudhury - Khaitan Public School",
  "Tejaswani Rathore - Amity International School Noida": "Tejaswini Rathore - Amity International School Noida",
  "Shreeya Barbal - Amity International School Noida": "Shreeya Babal - Amity International School Noida",
  "Aastik - Jaypee Public School": "Aastik Bajaj - Jaypee Public School",
  "Samikshya Panada - Deens Academy": "Samikshya Panda - Deens Academy",
  "Naina Gayatri Nath - Vasant Valley School": "Nayna Gayatri Nath - Vasant Valley School",
  "Lina Salwan - Jaypee Public School": "Lina Salwan - Army Public School, Shankar",
  "Arushi Tandon - Shiv Nadar School Faridabad": "Arushi Tandon - Shiv Nadar School Noida",
  "Tamanna Chandana - Shiv Nadar School Gurugram": "Tamanna Chandana - Shiv Nadar School Gurugram",
  "Vivsvat Rastogi - Vasant Valley School": "Vivsat Rastogi - Vasant Valley School",
}

docs = db.collection(u'votes')
c = 0

print()
for doc in docs.stream():
  if doc.id != 'master': 
    c += 1
    for subevent in doc.to_dict():
      if subevent != 'name': 
        updateVote = False
        subeventEdit = []
        subeventEditObj = {}
        for vote in doc.to_dict()[subevent]:
          voteEdit = vote
          if vote in corrections.keys(): 
            updateVote = True
            voteEdit = corrections[vote]
            print()
            print(doc.id)
            print(f'{vote} -> {corrections[vote]}')
          subeventEdit.append(voteEdit)
print(c)