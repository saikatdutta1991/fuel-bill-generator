# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static frontend-only web app that generates fuel bill receipts. Users select a template, configure options (paper texture, pump logo, optional fields), fill in receipt data, and preview the generated bill. Built with vanilla JS, jQuery, and Bootstrap 3.

## Running

No build step. Serve `index.html` with any static file server:

```
python3 -m http.server 8000
# or
npx serve .
```

Template HTML is fetched at runtime via `fetch()`, so a file server is required (no `file://` protocol).

## Architecture

**Template system** — inheritance-based pattern using Shadow DOM:

- `AbstractTemplate` — base class that fetches a template's `content.html` and renders it into a Shadow DOM container. All templates extend this.
- Each template lives in `templates/template-N/` with three files:
  - `Template{N}.js` — extends `AbstractTemplate`, implements `getConfig()` (returns field definitions, pump logos, paper textures, optional fields) and `renderData(data)` (populates the rendered DOM with user input).
  - `content.html` — the receipt HTML structure, loaded via fetch into a Shadow DOM.
  - `styles.css` — template-specific styles, referenced from `content.html` via `<link>`.

**Data flow**: `index.html` instantiates all templates → user selects one → `common.js:onTemplateSelected()` renders the config form and template preview → on any input change, `generate()` collects form values and calls `template.renderData(data)`.

**Key files**:
- `assets/js/common.js` — orchestration logic: form rendering, data collection, template selection, zoom slider, URL param handling
- `assets/images/` — pump logos and paper texture backgrounds
- `templates/templates.js` — unused/legacy template list (actual templates are instantiated in `index.html`)

## Adding a New Template

1. Create `templates/template-N/` with `Template{N}.js`, `content.html`, `styles.css`
2. Extend `AbstractTemplate`, set `this.contentUri`, implement `getConfig()` and `renderData(data)`
3. Add `<script src="templates/template-N/Template{N}.js">` in `index.html`
4. Add `new Template{N}("template-container")` to the `templates` array in `index.html`
5. Add a radio button for the new template in the HTML

## URL Parameters — Prefill & Auto-Preview

All inputs can be passed as URL query params to prefill the form and auto-generate the preview.

**Format**: `http://localhost:8000?template=1&texture=2&pumpLogo=1&address=My+Place&amount=500`

### Global params (all templates)

| Param | Type | Values | Description |
|-------|------|--------|-------------|
| `template` | number | `1`, `2`, `3` | Template selection (1-based) |
| `texture` | number | `1`–`6` | Paper texture index (1-based) |
| `pumpLogo` | number | `1`–`3` | Pump logo index: 1=Indian Oil, 2=HP Oil, 3=Bharat Petroleum |
| `surface` | string | `wooden-desk`, `dark-wood`, `white-tiles`, `beige-tiles`, `grey-marble`, `black-granite` | Preview surface background |
| `zoom` | number | `0`–`100` | Preview zoom percentage |

### Template 1 — Indian Oil thermal receipt style

**Optional fields** (value: `true` or `false`):

| Param | Description | Default |
|-------|-------------|---------|
| `showGST` | Show GSTIN row | `false` |
| `showCST` | Show CST row | `true` |
| `showLST` | Show LST row | `true` |
| `showVAT` | Show VAT row | `true` |

**Data fields**:

| Param | Label | Default Value | Notes |
|-------|-------|---------------|-------|
| `address` | Address | `GOKUL FUEL POINT YELANAHALLI, BEGUR 560068` | Pump station full address |
| `receiptNo` | Receipt No | `0000000000` | |
| `localId` | Local ID | `0000000000` | |
| `fipNo` | FIP No | `1` | Fuel injection pump number |
| `nozzelNo` | Nozzle No | `1` | |
| `product` | Product | `Petrol` | Fuel type: Petrol, Diesel, etc. |
| `presetType` | PresetType | `Amount` | Amount or Volume |
| `rate` | Rate | `101.94` | Price per litre (Rs/L) |
| `volume` | Volume | `0001.96` | Litres dispensed |
| `amount` | Amount | `200.006` | Total amount in Rs |
| `atot` | Atot | `0000000000.000` | Amount totalizer |
| `vtot` | Vtot | `0000000000.000` | Volume totalizer |
| `vehicleNo` | Vehicle No | `Not Entered` | |
| `mobileNo` | Mobile No | `Not Entered` | |
| `date` | Date | `00/00/00` | Format: DD/MM/YY |
| `time` | Time | `10:00` | Format: HH:MM |
| `cstNo` | CST No | *(empty)* | Central Sales Tax number |
| `lstNo` | LST No | *(empty)* | Local Sales Tax number |
| `vatNo` | VAT No | *(empty)* | |
| `gstNo` | GSTIN | *(empty)* | GST Identification Number |
| `attendantId` | Attendant ID | `Not Available` | |
| `fccDate` | FCC Date | `Not Available` | Fuel control computer date |
| `fccTime` | FCC Time | `Not Available` | Fuel control computer time |

### Template 2 — Bharat Petroleum simple bill

No optional fields or pump logo selection.

| Param | Label | Default Value | Notes |
|-------|-------|---------------|-------|
| `name` | Pump Name | `VENKATESWARA AND CO.` | |
| `subName` | Sub Name | `DEALERS IN BHARAT PETROLEUM CORP LTD` | Dealer tagline |
| `address` | Address | `HOSUR MAIN ROAD MADIWALA BLR-68` | |
| `gstNo` | GSTIN | `XXXXXXXXXXX` | |
| `date` | Date | `00/00/00` | |
| `billNo` | Bill No | `49121` | |
| `time` | Time | `16:35` | |
| `product` | Product | `PETROL` | |
| `rate` | Price | `102.90` | Per litre |
| `volume` | Volume | `1.944Lt` | Include unit |
| `amount` | Amount | `200.00` | |

### Template 3 — Card payment receipt with TXN details

**Optional fields** (value: `true` or `false`):

| Param | Description | Default |
|-------|-------------|---------|
| `showGST` | Show GSTIN row | `false` |
| `showCST` | Show CST row | `false` |
| `showVAT` | Show VAT row | `false` |

**Data fields**:

| Param | Label | Default Value | Notes |
|-------|-------|---------------|-------|
| `name` | Name | `GOKUL FUEL POINT` | Pump station name |
| `subAddress` | Sub Address | `BANGALORE` | City |
| `address` | Address | `No. 36/1, Yelanahalli Beg` | |
| `attendantName` | Attendant Name | `Sendhil Kumar A` | |
| `date` | Date | `02-09-2024` | Format: DD-MM-YYYY |
| `time` | Time | `11:36:02` | Format: HH:MM:SS |
| `mid` | MID | `47000009923321` | Merchant ID |
| `tid` | TID | `00608672` | Terminal ID |
| `batchNo` | Batch No | `000114` | |
| `invoiceNo` | Invoice No | `002394` | |
| `gstNo` | GSTIN | *(empty)* | |
| `cstNo` | CST | *(empty)* | |
| `vatNo` | VAT | *(empty)* | |
| `card` | Card | `**** **** **** 1234 CLSS` | Masked card number |
| `cardType` | Card Type | `MASTERCARD` | VISA, MASTERCARD, RUPAY |
| `expDate` | Exp Date | `**/**` | Masked expiry |
| `txnType` | Txn Type | `CARD` | Payment method |
| `apprCode` | APPR Code | `15930` | Approval code |
| `rrn` | RRN | `090200003919` | Retrieval Reference Number |
| `tc` | TC | `560E803334B60636` | Transaction Certificate |
| `tsi` | TSI | `0000` | Terminal Status Info |
| `atc` | ATC | `******` | Application Transaction Counter |
| `tvr` | TVR | `000000801` | Terminal Verification Results |
| `aid` | AID | `A0000000041010` | Application Identifier |
| `product` | Product | `Petrol` | |
| `txnId` | TXN ID | `2409020060862113540` | |
| `unitPrice` | Unit Price | `$ 102.86` | Include currency symbol |
| `quantity` | Quantity | `1.944 Ltr` | Include unit |
| `pumpNo` | Pump No | `8` | |
| `nozzleNo` | Nozzle No | `1` | |
| `totalSale` | Total Sale | `₹ 200.00` | Include ₹ symbol |
| `netAmount` | Net Amount | `₹ 200.00` | Include ₹ symbol |
| `version` | Software Version | `1.06.09_20240607` | POS software version string |
