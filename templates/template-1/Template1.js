class Template1 extends AbstractTemplate {
  constructor(containerElemId) {
    super(containerElemId);
    this.contentUri = "templates/template-1/content.html";
  }

  renderData(data) {
    if (!this.rendered) {
      console.log("Render the Template first");
      return;
    }

    // Render data
    const fields = this.getFields();
    fields.forEach((field) => {
      const value = data[field] || "";
      this.rootElem.find(`#${field} .data`).text(value);
    });

    if (data["pumpLogo"]) {
      this.rootElem.find(`#pumpLogo`).attr("src", data["pumpLogo"]);
    }

    data["showGST"]
      ? this.rootElem.find(`#gstNo`).show()
      : this.rootElem.find(`#gstNo`).hide();

    data["showCST"]
      ? this.rootElem.find(`#cstNo`).show()
      : this.rootElem.find(`#cstNo`).hide();

    data["showLST"]
      ? this.rootElem.find(`#lstNo`).show()
      : this.rootElem.find(`#lstNo`).hide();

    data["showVAT"]
      ? this.rootElem.find(`#vatNo`).show()
      : this.rootElem.find(`#vatNo`).hide();
  }

  getFields() {
    return [
      "address",
      "receiptNo",
      "localId",
      "fipNo",
      "nozzelNo",
      "product",
      "presetType",
      "rate",
      "volume",
      "amount",
      "atot",
      "vtot",
      "vehicleNo",
      "mobileNo",
      "date",
      "time",
      "cstNo",
      "lstNo",
      "vatNo",
      "gstNo",
      "attendantId",
      "fccDate",
      "fccTime",
    ];
  }
}
