#!/usr/bin/env python3
"""Generate fuel bill URLs for each month to reach ~₹10,000 target."""

import urllib.parse
import random
import math

random.seed(2025)

BASE_URL = "https://saikatdutta1991.github.io/fuel-bill-generator/"
RATE = 102.86  # Bengaluru petrol price ₹/L (stable throughout 2025-26)
VEHICLE_NO = "KA01MY2322"
TARGET = 10000

# ── Station Pool (real Bengaluru-style names) ──────────────────────────
STATIONS = [
    {"name": "SHREE SAI FUEL STATION", "address": "NO.42, BEGUR MAIN ROAD, HONGASANDRA, BANGALORE-560068",
     "pumpLogo": 1, "gstin": "29AABCS4521F1ZP", "brand": "Indian Oil", "templates": [1, 3]},
    {"name": "GOKUL FUEL POINT", "address": "NO.36/1, NEELADRI ROAD, ELECTRONIC CITY, BANGALORE-560100",
     "pumpLogo": 1, "gstin": "29AADCG7834K1ZM", "brand": "Indian Oil", "templates": [1]},
    {"name": "MAHALAKSHMI PETROLEUMS", "address": "80 FEET ROAD, KORAMANGALA 4TH BLOCK, BANGALORE-560034",
     "pumpLogo": 2, "gstin": "29AAFCM2956H1ZQ", "brand": "HP", "templates": [1, 3]},
    {"name": "SUNRISE PETROLEUM", "address": "HOSUR ROAD, MADIWALA, BANGALORE-560068",
     "pumpLogo": 2, "gstin": "29AABFS6123J1ZR", "brand": "HP", "templates": [1]},
    {"name": "SRI RAJA FUEL CENTER", "address": "BANNERGHATTA ROAD, AREKERE, BANGALORE-560076",
     "pumpLogo": 3, "gstin": "29AADCR8901L1ZS", "brand": "BPCL",
     "subName": "DEALERS IN BHARAT PETROLEUM CORP LTD", "templates": [2, 3]},
    {"name": "VENKATESWARA AND CO.", "address": "JP NAGAR 2ND PHASE, BANGALORE-560078",
     "pumpLogo": 3, "gstin": "29BBPCS4512K1Z8", "brand": "BPCL",
     "subName": "DEALERS IN BHARAT PETROLEUM CORP LTD", "templates": [2]},
    {"name": "NANDI SERVICE STATION", "address": "11TH MAIN, JAYANAGAR 4TH BLOCK, BANGALORE-560041",
     "pumpLogo": 1, "gstin": "29AAFCN5678P1ZT", "brand": "Indian Oil", "templates": [1, 3]},
    {"name": "SRI BALAJI FUEL POINT", "address": "16TH MAIN, BTM LAYOUT 2ND STAGE, BANGALORE-560076",
     "pumpLogo": 2, "gstin": "29AABCB3214G1ZU", "brand": "HP", "templates": [1, 3]},
    {"name": "LAKSHMI NARAYAN FUELS", "address": "SILK BOARD JUNCTION, HOSUR ROAD, BANGALORE-560068",
     "pumpLogo": 1, "gstin": "29AADCL4567M1ZV", "brand": "Indian Oil", "templates": [1]},
    {"name": "BHARATH SERVICE STATION", "address": "BOMMANAHALLI MAIN ROAD, BANGALORE-560068",
     "pumpLogo": 3, "gstin": "29AAFCB8912N1ZW", "brand": "BPCL",
     "subName": "DEALERS IN BHARAT PETROLEUM CORP LTD", "templates": [2, 3]},
]

SURFACES = ["wooden-desk", "dark-wood", "white-tiles", "beige-tiles", "grey-marble", "black-granite"]
ATTENDANT_NAMES = ["Sendhil Kumar A", "Ravi Shankar B", "Mohammed Ismail", "Venkatesh R",
                   "Suresh Kumar M", "Prakash N", "Ganesh K", "Rajesh S"]

# ── Existing bills data ────────────────────────────────────────────────
MONTHS = [
    {"key": "APR_25", "year": 2025, "month": 4, "days": 30, "existing": 5519, "dates": [1, 12, 13]},
    {"key": "JUN_25", "year": 2025, "month": 6, "days": 30, "existing": 4014, "dates": [1, 25, 28]},
    {"key": "JUL_25", "year": 2025, "month": 7, "days": 31, "existing": 400, "dates": [21, 28]},
    {"key": "AUG_25", "year": 2025, "month": 8, "days": 31, "existing": 1000, "dates": [1, 8, 14, 21, 29]},
    {"key": "SEP_25", "year": 2025, "month": 9, "days": 30, "existing": 2600, "dates": [9, 10, 16, 23, 28]},
    {"key": "OCT_25", "year": 2025, "month": 10, "days": 31, "existing": 1200, "dates": [24, 27]},
    {"key": "NOV_25", "year": 2025, "month": 11, "days": 30, "existing": 800, "dates": [3, 10, 19, 27]},
    {"key": "DEC_25", "year": 2025, "month": 12, "days": 31, "existing": 5652, "dates": [3, 4, 17, 19, 27]},
    {"key": "JAN_26", "year": 2026, "month": 1, "days": 31, "existing": 950, "dates": [5, 19]},
    {"key": "FEB_26", "year": 2026, "month": 2, "days": 28, "existing": 1396, "dates": [3, 17, 27]},
    {"key": "MAR_26", "year": 2026, "month": 3, "days": 21, "existing": 400, "dates": [16]},
]


def pick_dates(existing_dates, max_day, num_bills):
    """Pick dates with min 3-day gap from each other and min 2-day gap from existing."""
    occupied = set(existing_dates)
    candidates = []
    for d in range(1, max_day + 1):
        if d not in occupied and all(abs(d - e) >= 2 for e in occupied):
            candidates.append(d)

    picked = []
    for c in candidates:
        if all(abs(c - p) >= 3 for p in picked):
            picked.append(c)
            if len(picked) >= num_bills:
                break

    # If not enough, relax gap to 2 between new dates
    if len(picked) < num_bills:
        for c in candidates:
            if c not in picked and all(abs(c - p) >= 2 for p in picked):
                picked.append(c)
                if len(picked) >= num_bills:
                    break

    picked.sort()
    return picked[:num_bills]


def make_consistent(amount_target, rate):
    """Given a target amount, find volume (3dp) so rate × volume ≈ amount (2dp)."""
    vol = round(amount_target / rate, 3)
    amt = round(rate * vol, 2)
    return amt, vol


def distribute_amounts(needed, num_bills):
    """Generate realistic amounts summing to ~needed."""
    amounts = []
    remaining = float(needed)

    for i in range(num_bills):
        left = num_bills - i
        if left == 1:
            amounts.append(remaining)
            break

        avg = remaining / left
        r = random.random()

        # Amount distribution
        if r < 0.12 and avg > 600:
            # Small top-up (10-15%)
            target = random.uniform(400, 700)
        elif r < 0.30 and remaining > 2000 * left:
            # Large fill (15-20%)
            target = random.uniform(1800, 2500)
        else:
            # Normal fill (65-75%)
            target = random.uniform(800, 1600)

        # Clamp so remaining bills stay in reasonable range
        min_remaining = 400 * (left - 1)
        max_remaining = 2500 * (left - 1)
        target = max(400, min(target, remaining - min_remaining))
        target = min(2500, max(target, remaining - max_remaining))

        amounts.append(round(target, 2))
        remaining -= amounts[-1]

    return amounts


def gen_time():
    h = random.choice([6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20])
    m = random.randint(0, 59)
    return f"{h:02d}:{m:02d}"


def gen_time_full():
    return f"{gen_time()}:{random.randint(0,59):02d}"


def build_url_t1(station, day, month, year, time_str, rate, vol, amt, texture, surface, vehicle=None):
    date_str = f"{day:02d}/{month:02d}/{year % 100:02d}"
    p = {
        "template": "1", "texture": str(texture), "pumpLogo": str(station["pumpLogo"]),
        "surface": surface, "showGST": "true", "showCST": "false", "showLST": "false", "showVAT": "false",
        "address": station["address"],
        "receiptNo": str(random.randint(100000, 9999999)),
        "localId": str(random.randint(1000000, 9999999)),
        "fipNo": str(random.randint(1, 8)),
        "nozzelNo": str(random.randint(1, 4)),
        "product": "Petrol", "presetType": "Amount",
        "rate": f"{rate:.2f}", "volume": f"{vol:.3f}", "amount": f"{amt:.2f}",
        "date": date_str, "time": time_str,
        "gstNo": station["gstin"],
        "attendantId": f"EMP{random.randint(1, 99):04d}",
    }
    if vehicle:
        p["vehicleNo"] = vehicle
    return BASE_URL + "?" + urllib.parse.urlencode(p)


def build_url_t2(station, day, month, year, time_str, rate, vol, amt, texture, surface):
    date_str = f"{day:02d}/{month:02d}/{year % 100:02d}"
    p = {
        "template": "2", "texture": str(texture), "pumpLogo": str(station["pumpLogo"]),
        "surface": surface,
        "name": station["name"],
        "subName": station.get("subName", f"DEALERS IN {station['brand'].upper()} PRODUCTS"),
        "address": station["address"],
        "gstNo": station["gstin"],
        "date": date_str, "billNo": str(random.randint(10000, 99999)),
        "time": time_str, "product": "PETROL",
        "rate": f"{rate:.2f}", "volume": f"{vol:.3f}Lt", "amount": f"{amt:.2f}",
    }
    return BASE_URL + "?" + urllib.parse.urlencode(p)


def build_url_t3(station, day, month, year, time_str, rate, vol, amt, texture, surface, vehicle=None):
    date_str = f"{day:02d}-{month:02d}-{year}"
    p = {
        "template": "3", "texture": str(texture), "pumpLogo": str(station["pumpLogo"]),
        "surface": surface, "showGST": "true", "showCST": "false", "showVAT": "false",
        "name": station["name"], "subAddress": "BANGALORE",
        "address": station["address"],
        "attendantName": random.choice(ATTENDANT_NAMES),
        "date": date_str, "time": time_str,
        "mid": str(random.randint(10000000000000, 99999999999999)),
        "tid": f"{random.randint(100000, 999999):08d}",
        "batchNo": f"{random.randint(1, 999):06d}",
        "invoiceNo": f"{random.randint(1, 9999):06d}",
        "gstNo": station["gstin"],
        "card": f"**** **** **** {random.randint(1000, 9999)} CLSS",
        "cardType": random.choice(["MASTERCARD", "VISA", "RUPAY"]),
        "expDate": "**/**", "txnType": "CARD",
        "apprCode": str(random.randint(10000, 99999)),
        "rrn": str(random.randint(100000000000, 999999999999)),
        "tc": ''.join(random.choices("0123456789ABCDEF", k=16)),
        "tsi": "0000", "atc": "******", "tvr": "000000801",
        "aid": "A0000000041010", "product": "Petrol",
        "txnId": str(random.randint(1000000000000000000, 9999999999999999999)),
        "unitPrice": f"$ {rate:.2f}",
        "quantity": f"{vol:.3f} Ltr",
        "pumpNo": str(random.randint(1, 12)),
        "nozzleNo": str(random.randint(1, 4)),
        "totalSale": f"\u20b9 {amt:.2f}",
        "netAmount": f"\u20b9 {amt:.2f}",
    }
    if vehicle:
        p["vehicleNo"] = vehicle
    return BASE_URL + "?" + urllib.parse.urlencode(p)


# ── Main generation ───────────────────────────────────────────────────

# Count total bills first to pick ~5% for vehicle number
bill_plan = []
for md in MONTHS:
    needed = TARGET - md["existing"]
    if needed <= 0:
        continue
    num = 4 if needed <= 3500 else (5 if needed <= 6500 else 6)
    bill_plan.append((md, num))

total_bills = sum(n for _, n in bill_plan)
num_vehicle = max(1, round(total_bills * 0.05))
vehicle_indices = set(random.sample(range(total_bills), min(num_vehicle, total_bills)))

bill_counter = 0

for md, num_bills in bill_plan:
    needed = TARGET - md["existing"]
    dates = pick_dates(md["dates"], md["days"], num_bills)
    if len(dates) < num_bills:
        num_bills = len(dates)

    raw_amounts = distribute_amounts(needed, num_bills)

    # Make each amount consistent with rate
    bills = []
    trunc_sum = 0
    for i, raw_amt in enumerate(raw_amounts):
        amt, vol = make_consistent(raw_amt, RATE)
        bills.append({"day": dates[i], "amount": amt, "volume": vol})
        trunc_sum += int(amt)

    # Adjust last bill to hit target
    month_total = md["existing"] + trunc_sum
    diff = TARGET - month_total
    if diff != 0:
        last = bills[-1]
        new_target = last["amount"] + diff
        if new_target < 300:
            new_target = 400
        new_amt, new_vol = make_consistent(new_target, RATE)
        bills[-1]["amount"] = new_amt
        bills[-1]["volume"] = new_vol

    # Recalculate final total
    trunc_sum = sum(int(b["amount"]) for b in bills)
    month_total = md["existing"] + trunc_sum

    # Print month header
    print(f"\n{'='*80}")
    print(f"  {md['key']}  |  Existing: ₹{md['existing']}  |  New: ₹{trunc_sum}  |  TOTAL: ₹{month_total}")
    print(f"{'='*80}")

    for i, b in enumerate(bills):
        has_vehicle = bill_counter in vehicle_indices
        bill_counter += 1

        station = random.choice(STATIONS)
        template = random.choice(station["templates"])
        texture = random.randint(1, 6)
        surface = random.choice(SURFACES)

        day, m, y = b["day"], md["month"], md["year"]
        amt, vol = b["amount"], b["volume"]
        trunc_amt = int(amt)
        filename = f"{day:02d}_{m:02d}_{y}_{trunc_amt}.jpg"
        vehicle = VEHICLE_NO if has_vehicle else None

        if template == 1:
            url = build_url_t1(station, day, m, y, gen_time(), RATE, vol, amt, texture, surface, vehicle)
        elif template == 2:
            url = build_url_t2(station, day, m, y, gen_time(), RATE, vol, amt, texture, surface)
        else:
            url = build_url_t3(station, day, m, y, gen_time_full(), RATE, vol, amt, texture, surface, vehicle)

        v_tag = " [VEH: KA01MY2322]" if has_vehicle else ""
        print(f"\n  Bill {i+1}: {filename}")
        print(f"  ₹{amt:.2f} | {vol:.3f}L @ ₹{RATE}/L | {station['name']} ({station['brand']}) | T{template}{v_tag}")
        print(f"  {url}")

    print(f"\n  → Month total: {md['existing']} + {trunc_sum} = {month_total}")
