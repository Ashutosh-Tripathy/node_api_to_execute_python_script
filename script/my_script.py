import time
import json
data = json.loads((input()))
time.sleep(1)
result = {"message": "from python: Hi " + data.get("name", "")}
print(json.dumps(result))
