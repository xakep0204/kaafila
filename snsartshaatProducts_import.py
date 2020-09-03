import csv, firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate('/users/aditya/dev/kaafila-security/serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
doc_ref = db.collection('snsartshaatProducts')
filename = "/users/aditya/dev/kaafila/snsartshaatProducts.csv"
fields = []
rows = []
products = []
with open(filename, 'r') as csvfile:
	csvreader = csv.reader(csvfile)
	fields = next(csvreader)
	for row in csvreader:
		rows.append(row)
for i in rows:
  product_curr = {}
  c = 1
  for j in i[1:]:
    if c == 3: product_curr[fields[c]] = int(j)
    else: product_curr[fields[c]] = j
    c += 1
  products.append(product_curr)
  doc_ref.add(product_curr)
  print(product_curr)