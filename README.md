# Fuel Bill Generator

A browser-based fuel bill receipt generator. Select a template, customize the look, fill in receipt data, and preview or download the generated bill as an image.

**Live Demo:** [https://saikatdutta1991.github.io/fuel-bill-generator/](https://saikatdutta1991.github.io/fuel-bill-generator/)

## Features

- **3 receipt templates** — Indian Oil thermal receipt, Bharat Petroleum simple bill, and card payment receipt with full TXN details
- **Paper textures** — 6 realistic paper texture backgrounds
- **Pump logos** — Indian Oil, HP Oil, Bharat Petroleum
- **Surface backgrounds** — Wooden Desk, Dark Wood, White Tiles, Beige Tiles, Grey Marble, Black Granite
- **Optional fields** — Toggle GSTIN, CST, LST, VAT rows on/off
- **Zoom slider** — Scale the preview from 0–100%
- **Download as PNG** — Export the bill with surface background as a timestamped image
- **URL prefill** — Pass all inputs as URL query params to auto-fill the form and generate the preview instantly

## Running Locally

No build step required. Serve the project with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000).

> **Note:** A file server is required — opening `index.html` via `file://` won't work because templates are loaded at runtime via `fetch()`.

## URL Parameters

All form inputs can be passed as URL query params to prefill data and auto-generate the preview. This is useful for bookmarking specific bills or sharing pre-configured links.

**Format:**
```
https://saikatdutta1991.github.io/fuel-bill-generator/?template=1&texture=2&pumpLogo=1&address=My+Place&amount=500
```

### Global Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `template` | `1`, `2`, `3` | Template selection |
| `texture` | `1`–`6` | Paper texture (index) |
| `pumpLogo` | `1`–`3` | 1 = Indian Oil, 2 = HP Oil, 3 = Bharat Petroleum |
| `surface` | `wooden-desk`, `dark-wood`, `white-tiles`, `beige-tiles`, `grey-marble`, `black-granite` | Preview surface |
| `zoom` | `0`–`100` | Preview zoom % |

### Template 1 — Indian Oil Thermal Receipt

**Optional fields** (`true` / `false`): `showGST`, `showCST`, `showLST`, `showVAT`

**Data fields:**

| Param | Description | Example |
|-------|-------------|---------|
| `address` | Pump station address | `GOKUL FUEL POINT, BEGUR 560068` |
| `receiptNo` | Receipt number | `1045823` |
| `localId` | Local ID | `8827361` |
| `fipNo` | Fuel injection pump no. | `3` |
| `nozzelNo` | Nozzle number | `2` |
| `product` | Fuel type | `Petrol` |
| `presetType` | Preset type | `Amount` |
| `rate` | Rate per litre (Rs/L) | `102.86` |
| `volume` | Litres dispensed | `4.862` |
| `amount` | Total amount (Rs) | `500.00` |
| `atot` | Amount totalizer | `0000125400.000` |
| `vtot` | Volume totalizer | `0000001220.500` |
| `vehicleNo` | Vehicle number | `KA01AB1234` |
| `mobileNo` | Mobile number | `9876543210` |
| `date` | Date (DD/MM/YY) | `21/03/26` |
| `time` | Time (HH:MM) | `14:35` |
| `cstNo` | CST number | |
| `lstNo` | LST number | |
| `vatNo` | VAT number | |
| `gstNo` | GSTIN | `29AABCU9603R1ZM` |
| `attendantId` | Attendant ID | `EMP0042` |
| `fccDate` | FCC date | `21/03/26` |
| `fccTime` | FCC time | `14:30` |

### Template 2 — Bharat Petroleum Simple Bill

| Param | Description | Example |
|-------|-------------|---------|
| `name` | Pump name | `VENKATESWARA AND CO.` |
| `subName` | Dealer tagline | `DEALERS IN BHARAT PETROLEUM CORP LTD` |
| `address` | Address | `HOSUR MAIN ROAD MADIWALA BLR-68` |
| `gstNo` | GSTIN | `29BBPCS4512K1Z8` |
| `date` | Date | `21/03/26` |
| `billNo` | Bill number | `49121` |
| `time` | Time | `16:35` |
| `product` | Product | `PETROL` |
| `rate` | Price per litre | `102.90` |
| `volume` | Volume (include unit) | `1.944Lt` |
| `amount` | Amount | `200.00` |

### Template 3 — Card Payment Receipt

**Optional fields** (`true` / `false`): `showGST`, `showCST`, `showVAT`

**Data fields:**

| Param | Description | Example |
|-------|-------------|---------|
| `name` | Pump name | `GOKUL FUEL POINT` |
| `subAddress` | City | `BANGALORE` |
| `address` | Address | `No. 36/1, Yelanahalli Beg` |
| `attendantName` | Attendant name | `Sendhil Kumar A` |
| `date` | Date (DD-MM-YYYY) | `21-03-2026` |
| `time` | Time (HH:MM:SS) | `11:36:02` |
| `mid` | Merchant ID | `47000009923321` |
| `tid` | Terminal ID | `00608672` |
| `batchNo` | Batch number | `000114` |
| `invoiceNo` | Invoice number | `002394` |
| `gstNo` | GSTIN | `29AADCG1234F1ZP` |
| `cstNo` | CST | |
| `vatNo` | VAT | |
| `card` | Masked card number | `**** **** **** 1234 CLSS` |
| `cardType` | Card type | `MASTERCARD` |
| `expDate` | Masked expiry | `**/**` |
| `txnType` | Transaction type | `CARD` |
| `apprCode` | Approval code | `15930` |
| `rrn` | Retrieval Reference No. | `090200003919` |
| `tc` | Transaction Certificate | `560E803334B60636` |
| `tsi` | Terminal Status Info | `0000` |
| `atc` | Application Txn Counter | `******` |
| `tvr` | Terminal Verification | `000000801` |
| `aid` | Application Identifier | `A0000000041010` |
| `product` | Fuel type | `Petrol` |
| `txnId` | Transaction ID | `2409020060862113540` |
| `unitPrice` | Unit price (with symbol) | `$ 102.86` |
| `quantity` | Quantity (with unit) | `1.944 Ltr` |
| `pumpNo` | Pump number | `8` |
| `nozzleNo` | Nozzle number | `1` |
| `totalSale` | Total sale (with ₹) | `₹ 200.00` |
| `netAmount` | Net amount (with ₹) | `₹ 200.00` |
| `version` | POS software version | `1.06.09_20240607` |

## Example URLs

**Template 1 — Rs 500 petrol fill:**
```
https://saikatdutta1991.github.io/fuel-bill-generator/?template=1&texture=4&pumpLogo=1&showGST=true&showCST=false&showLST=false&showVAT=false&address=SHREE%20SAI%20FUEL%20STATION%2C%20MG%20ROAD%20560001&receiptNo=1045823&localId=8827361&fipNo=3&nozzelNo=2&product=Petrol&presetType=Amount&rate=102.86&volume=4.862&amount=500.00&vehicleNo=KA01AB1234&mobileNo=9876543210&date=21%2F03%2F26&time=14%3A35&gstNo=29AABCU9603R1ZM&attendantId=EMP0042
```

**Template 2 — Simple bill:**
```
https://saikatdutta1991.github.io/fuel-bill-generator/?template=2&texture=5&name=VENKATESWARA%20AND%20CO.&subName=DEALERS%20IN%20BHARAT%20PETROLEUM%20CORP%20LTD&address=HOSUR%20MAIN%20ROAD%20MADIWALA%20BLR-68&gstNo=29BBPCS4512K1Z8&date=21%2F03%2F26&billNo=49121&time=16%3A35&product=PETROL&rate=102.90&volume=1.944Lt&amount=200.00&surface=dark-wood
```

**Template 3 — Card payment receipt:**
```
https://saikatdutta1991.github.io/fuel-bill-generator/?template=3&texture=3&pumpLogo=1&showGST=true&name=GOKUL%20FUEL%20POINT&subAddress=BANGALORE&address=No.%2036%2F1%2C%20Yelanahalli%20Beg&attendantName=Sendhil%20Kumar%20A&date=21-03-2026&time=11%3A36%3A02&product=Petrol&unitPrice=%24%20102.86&quantity=1.944%20Ltr&totalSale=%E2%82%B9%20200.00&netAmount=%E2%82%B9%20200.00&surface=grey-marble
```

## Tech Stack

- Vanilla JavaScript + jQuery 3.7.1
- Bootstrap 3.4.1
- Shadow DOM for template isolation
- html2canvas for PNG export
