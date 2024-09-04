class Template3 extends AbstractTemplate {
  constructor(containerElemId) {
    super(containerElemId);
    this.contentUri = "templates/template-3/content.html";
  }

  renderData(data) {
    if (!this.rendered) {
      throw Error("Render the Template first");
    }

    // Render data
    const fieldList = this.getConfig().fieldList || [];
    if (fieldList.length > 0) {
      fieldList.forEach((field) => {
        const value = data[field.id] || "";
        this.rootElem.find(`#${field.id} .data`).text(value);
      });
    }

    const pumpLogoList = this.getConfig().pumpLogoList || [];
    if (pumpLogoList.length > 0) {
      pumpLogoList.forEach((field) => {
        const value = data[field.id] || "";
        if (value) {
          this.rootElem.find(`#pumpLogo`).attr("src", value);
        }
      });
    }

    const paperTextureList = this.getConfig().paperTextureList || [];
    if (paperTextureList.length > 0) {
      paperTextureList.forEach((field) => {
        const value = data[field.id] || "";
        if (value) {
          this.rootElem
            .find(`.template-container`)
            .css("background-image", `url('${value}')`);
        }
      });
    }

    const optionalFieldList = this.getConfig().optionalFieldList || [];
    if (optionalFieldList.length > 0) {
      optionalFieldList.forEach((field) => {
        const value = data[field.id];
        value
          ? this.rootElem.find(`#${field.refId}`).show()
          : this.rootElem.find(`#${field.refId}`).hide();
      });
    }
  }

  getConfig() {
    return {
      optionalFieldList: [
        {
          id: "showGST",
          name: "GSTIN No.",
          refId: "gstNo",
          value: "true",
          checked: false,
        },
        {
          id: "showCST",
          name: "CST No",
          refId: "cstNo",
          value: "true",
          checked: false,
        },
        {
          id: "showVAT",
          name: "VAT No",
          refId: "vatNo",
          value: "true",
          checked: false,
        },
      ],
      pumpLogoList: [
        {
          id: "pumpLogo",
          name: "Indian Oil",
          uri: "assets/images/pump-logo-indian-oil.webp",
          default: true,
        },
        {
          id: "pumpLogo",
          name: "Hp Oil",
          uri: "assets/images/pump-logo-hp.webp",
        },
        {
          id: "pumpLogo",
          name: "Bharat Petroleum",
          uri: "assets/images/pump-logo-bharat-petroleum.webp",
        },
      ],
      paperTextureList: [
        {
          id: "texture",
          name: "Texture 1",
          uri: "assets/images/textures/texture-1.jpeg",
        },
        {
          id: "texture",
          name: "Texture 2",
          uri: "assets/images/textures/texture-2.jpeg",
        },
        {
          id: "texture",
          name: "Texture 3",
          uri: "assets/images/textures/texture-3.avif",
        },
        {
          id: "texture",
          name: "Texture 4",
          uri: "assets/images/textures/texture-4.avif",
        },
        {
          id: "texture",
          name: "Texture 5",
          uri: "assets/images/textures/texture-5.avif",
        },
        {
          id: "texture",
          name: "Texture 6",
          uri: "assets/images/textures/texture-6.jpeg",
          default: true,
        },
      ],
      fieldList: [
        {
          id: "name",
          name: "Name",
          defaultValue: "GOKUL FUEL POINT",
        },
        {
          id: "subAddress",
          name: "Sub Address",
          defaultValue: "BANGALORE",
        },
        {
          id: "address",
          name: "Address",
          defaultValue: "No. 36/1, Yelanahalli Beg",
        },
        {
          id: "attendantName",
          name: "Attendant Name",
          defaultValue: "Sendhil Kumar A",
        },
        {
          id: "date",
          name: "Date",
          defaultValue: "02-09-2024",
        },
        {
          id: "time",
          name: "Time",
          defaultValue: "11:36:02",
        },
        {
          id: "mid",
          name: "MID",
          defaultValue: "47000009923321",
        },
        {
          id: "tid",
          name: "TID",
          defaultValue: "00608672",
        },
        {
          id: "batchNo",
          name: "Batch No",
          defaultValue: "000114",
        },
        {
          id: "invoiceNo",
          name: "Invoice No",
          defaultValue: "002394",
        },
        {
          id: "gstNo",
          name: "GSTIN",
          defaultValue: "",
        },
        {
          id: "cstNo",
          name: "CST",
          defaultValue: "",
        },
        {
          id: "vatNo",
          name: "VAT",
          defaultValue: "",
        },
        {
          id: "card",
          name: "Card",
          defaultValue: "**** **** **** 1234 CLSS",
        },
        {
          id: "cardType",
          name: "Card Type",
          defaultValue: "MASTERCARD",
        },
        {
          id: "expDate",
          name: "Exp Date",
          defaultValue: "**/**",
        },
        {
          id: "txnType",
          name: "Txn Type",
          defaultValue: "CARD",
        },
        {
          id: "apprCode",
          name: "APPR Code",
          defaultValue: "15930",
        },
        {
          id: "rrn",
          name: "RRN",
          defaultValue: "090200003919",
        },
        {
          id: "tc",
          name: "TC",
          defaultValue: "560E803334B60636",
        },
        {
          id: "tsi",
          name: "TSI",
          defaultValue: "0000",
        },
        {
          id: "atc",
          name: "ATC",
          defaultValue: "******",
        },
        {
          id: "tvr",
          name: "TVR",
          defaultValue: "000000801",
        },
        {
          id: "aid",
          name: "AID",
          defaultValue: "A0000000041010",
        },
        {
          id: "product",
          name: "Product",
          defaultValue: "Petrol",
        },
        {
          id: "txnId",
          name: "TXN ID",
          defaultValue: "2409020060862113540",
        },
        {
          id: "unitPrice",
          name: "Unit Price",
          defaultValue: "$ 102.86",
        },
        {
          id: "quantity",
          name: "Quantity",
          defaultValue: "1.944 Ltr",
        },

        {
          id: "pumpNo",
          name: "Pump No",
          defaultValue: "8",
        },
        {
          id: "nozzleNo",
          name: "Nozzle No",
          defaultValue: "1",
        },

        {
          id: "totalSale",
          name: "Total Sale",
          defaultValue: "₹ 200.00",
        },
        {
          id: "netAmount",
          name: "Net Amount",
          defaultValue: "₹ 200.00",
        },
        {
          id: "version",
          name: "Software Version",
          defaultValue: "1.06.09_20240607",
        },
      ],
    };
  }
}
