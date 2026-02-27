import json, re

def check_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()
    
    matches = re.finditer(r"<script type=[\"']application/ld\+json[\"']>([\s\S]*?)</script>", content)
    
    all_valid = True
    count = 0
    for i, match in enumerate(matches):
        count += 1
        json_str = match.group(1).strip()
        try:
            json.loads(json_str)
            print(f"{filepath} Block {i+1}: Valid JSON")
        except json.JSONDecodeError as e:
            print(f"{filepath} Block {i+1}: Invalid JSON - {e}")
            all_valid = False
            
    if count == 0:
        print(f"{filepath} No JSON-LD blocks found")
        
    return all_valid

all_valid = check_file("index.html") and check_file("about.html") and check_file("what-we-do.html")
print("All JSON-LD blocks valid:", all_valid)
