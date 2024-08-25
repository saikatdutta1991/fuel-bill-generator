async function onTemplateSelected() {
  templateIndex = Number($("input[name=template]:checked").val());
  template = templates[templateIndex];
  renderTemplateForm(template);
  await template.render();
  generate(template);
}

function renderTemplateForm(template) {
  // Paper texture
  const paperTextureList = template.getConfig().paperTextureList || [];
  if (paperTextureList.length == 0) {
    $("#section-paper-texture").hide();
  } else {
    const elem = $("#section-paper-texture > .panel-body");
    elem.html("");
    paperTextureList.forEach((field) => {
      elem.append(`
        <label class="radio-inline">
          <input type="radio" name="${field.id}" value="${field.uri}" ${
        field.default ? "checked" : ""
      }/>
          ${field.name}
        </label>
      `);
    });
    $("#section-paper-texture").show();
  }

  // Pump logo
  const pumpLogoList = template.getConfig().pumpLogoList || [];
  if (pumpLogoList.length == 0) {
    $("#section-pump-logo").hide();
  } else {
    const elem = $("#section-pump-logo > .panel-body");
    elem.html("");
    pumpLogoList.forEach((field) => {
      elem.append(`
        <label class="radio-inline">
          <input type="radio" name="${field.id}" value="${field.uri}"
          ${field.default ? "checked" : ""}
          />
          ${field.name}
        </label>
      `);
    });
    $("#section-pump-logo").show();
  }

  // Optional Fields
  const optionalFieldList = template.getConfig().optionalFieldList || [];
  if (optionalFieldList.length == 0) {
    $("#section-optional-fields").hide();
  } else {
    const elem = $("#section-optional-fields > .panel-body");
    elem.html("");
    optionalFieldList.forEach((field) => {
      elem.append(`
        <label class="checkbox-inline">
          <input type="checkbox" name="${field.id}" value="${field.value}" ${
        field.checked ? "checked" : ""
      }/>
          ${field.name}
        </label>
      `);
    });
    $("#section-optional-fields").show();
  }

  // Section data
  const fieldList = template.getConfig().fieldList || [];
  if (fieldList.length == 0) {
    $("#section-data").hide();
  } else {
    const elem = $("#section-data > .panel-body > .row");
    elem.html("");
    fieldList.forEach((field) => {
      elem.append(`
      <div class="form-group col-md-4">
        <label for="${field.id}">${field.name}</label>
        <input type="text" class="form-control" name="${field.id}" value="${field.defaultValue}"/>
      </div>
      `);
    });
    $("#section-data").show();
  }
}

function generate(template) {
  const data1 = { texture: getRadioValue("#section-paper-texture", "texture") };
  const data2 = { pumpLogo: getRadioValue("#section-pump-logo", "pumpLogo") };
  const data3 = getCheckedValues("#section-optional-fields");
  console.log({ data3 });
  const data4 = getDataValues("#section-data");
  const data = { ...data1, ...data2, ...data3, ...data4 };
  template.renderData(data);
}

function getCheckedValues(element) {
  const data = getDataValues(element);
  Object.keys(data).forEach((key) => {
    data[key] = isChecked(element, key, "true");
  });
  return data;
}

function isChecked(element, inputName, compareStr) {
  return (
    $(element).find(`input[name="${inputName}"]:checked`).val() == compareStr
  );
}

function getRadioValue(element, inputName) {
  return $(element).find(`input[name="${inputName}"]:checked`).val();
}

function getDataValues(element) {
  const data = {};
  $(element)
    .find("input")
    .each(function () {
      var name = $(this).attr("name");
      var value = $(this).val();
      data[name] = value;
    });
  return data;
}

function initZoomSlider() {
  $("#percentage-slider").on("input", function () {
    var value = $(this).val();
    $("#slider-value").text(value + "%");
    $("#template-container").css("zoom", `${value}%`);
  });
}
