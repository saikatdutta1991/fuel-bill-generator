class Template2 extends AbstractTemplate {
  constructor(containerElemId) {
    super(containerElemId);
    this.contentUri = "templates/template-2/content.html";
  }

  renderData(data) {
    if (!this.rendered) {
      throw Error("Render the Template first");
    }
    console.log(data);
    // Render data
    const fieldList = this.getConfig().fieldList || [];
    if (fieldList.length > 0) {
      fieldList.forEach((field) => {
        const value = data[field.id] || "";
        console.log({ id: field.id, value });
        this.rootElem.find(`#${field.id} .data`).text(value);
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
  }

  getConfig() {
    return {
      optionalFieldList: [],
      pumpLogoList: [],
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
          default: true,
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
        },
      ],
      fieldList: [
        {
          id: "name",
          name: "Pump Name",
          defaultValue: "VENKATESWARA AND CO.",
        },
        {
          id: "subName",
          name: "Sub Name",
          defaultValue: "DEALERS IN BHARAT PETROLEUM CORP LTD",
        },
        {
          id: "address",
          name: "Address",
          defaultValue: "HOSUR MAIN ROAD MADIWALA BLR-68",
        },
        {
          id: "gstNo",
          name: "GSTIN",
          defaultValue: "XXXXXXXXXXX",
        },
        {
          id: "date",
          name: "Date",
          defaultValue: "00/00/00",
        },
        {
          id: "billNo",
          name: "Bill No",
          defaultValue: "49121",
        },
        {
          id: "time",
          name: "Time",
          defaultValue: "16:35",
        },
        {
          id: "product",
          name: "Product",
          defaultValue: "PETROL",
        },
        {
          id: "rate",
          name: "Price",
          defaultValue: "102.90",
        },
        {
          id: "volume",
          name: "Volume",
          defaultValue: "1.944Lt",
        },
        {
          id: "amount",
          name: "Amount",
          defaultValue: "200.00",
        },
      ],
    };
  }
}
