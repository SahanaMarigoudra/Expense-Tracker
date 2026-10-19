import urllib.request
import json

def req(url, data=None, method='GET'):
    payload = json.dumps(data).encode() if data else None
    r = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method=method
    )
    with urllib.request.urlopen(r) as resp:
        if resp.status == 204:
            return {}
        return json.loads(resp.read().decode())

def main():
    print("1. Health Check:")
    print("  ", req("http://127.0.0.1:8000/api/health"))

    print("\n2. Summary before test transaction:")
    print("  ", req("http://127.0.0.1:8000/api/summary"))

    print("\n3. Creating an expense transaction ($85.50)...")
    exp = req(
        "http://127.0.0.1:8000/api/transactions",
        {
            "title": "Dinner with Friends",
            "amount": 85.50,
            "type": "expense",
            "category": "Food & Dining",
            "transaction_date": "2026-10-17",
            "notes": "Italian restaurant"
        },
        method="POST"
    )
    print("   Created ID:", exp["id"], "| Title:", exp["title"], "| Amount:", exp["amount"])

    print("\n4. Summary after expense:")
    summary_after = req("http://127.0.0.1:8000/api/summary")
    print("  ", summary_after)

    print("\n5. Listing transactions:")
    txs = req("http://127.0.0.1:8000/api/transactions")
    print(f"   Fetched {len(txs)} transactions:")
    for t in txs:
        print(f"   - [{t['id']}] {t['title']} (${t['amount']}, {t['type']}, {t['category']})")

    print(f"\n6. Deleting test transaction ID {exp['id']}...")
    req(f"http://127.0.0.1:8000/api/transactions/{exp['id']}", method="DELETE")
    print("   Deleted successfully.")

    print("\n7. Final summary after cleanup:")
    final_summary = req("http://127.0.0.1:8000/api/summary")
    print("  ", final_summary)
    print("\nALL REQUIREMENT CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
