import re
import sys

try:
    content = open("app/agent.py").read()
    if re.search(r"AIzaSyD-mock-key-value-12345", content):
        print("CRITICAL SECURITY ERROR: Hardcoded API Key detected in app/agent.py!")
        sys.exit(1)
    else:
        print("Security gate passed.")
        sys.exit(0)
except FileNotFoundError:
    print("app/agent.py not found, skipping security gate check.")
    sys.exit(0)
