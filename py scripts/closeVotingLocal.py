import json, re
main_db = {}
with open('routes/eventRoutes.json', errors='ignore') as f: data = json.load(f)

for event in data:
  for subevent in data[event]:
    if not (subevent in ["title", "name", "cssID", "headerFont", "eventCategories", "navID"]):
      main_db[subevent] = {'closed': True}
      print(f'Closed {subevent}')

local_file = open("routes/links.json", "w") 
local_file.writelines(json.dumps(main_db, indent=2, sort_keys=True)) 
local_file.close() 