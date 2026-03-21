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
          <input class="optional-fields" type="checkbox" name="${
            field.id
          }" value="${field.value}" ${field.checked ? "checked" : ""}/>
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
        <input type="text" class="form-control text-input" name="${field.id}" value="${field.defaultValue}"/>
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

async function downloadBill(template) {
  if (!template || !template.rendered) return;

  // Get the shadow DOM content and its styles
  var shadowRoot = template.shadowRoot;
  var shadowHTML = shadowRoot.innerHTML;

  // Collect all stylesheet contents from the shadow root
  var styleSheets = shadowRoot.querySelectorAll('link[rel="stylesheet"]');
  var cssTexts = [];
  for (var i = 0; i < styleSheets.length; i++) {
    try {
      var resp = await fetch(styleSheets[i].href);
      var cssText = await resp.text();
      cssTexts.push(cssText);
    } catch (e) {
      // skip if fetch fails
    }
  }

  // Also collect font-face rules from the main document for the template fonts
  var mainStyles = document.styleSheets;
  var fontFaceCSS = "";
  for (var i = 0; i < mainStyles.length; i++) {
    try {
      var rules = mainStyles[i].cssRules;
      for (var j = 0; j < rules.length; j++) {
        if (rules[j] instanceof CSSFontFaceRule) {
          fontFaceCSS += rules[j].cssText + "\n";
        }
      }
    } catch (e) {
      // skip cross-origin stylesheets
    }
  }

  // Get the surface background styles from the container
  var container = document.getElementById("template-container");
  var containerStyles = window.getComputedStyle(container);

  // Build the temporary capture element
  var wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.zIndex = "-1";
  wrapper.style.padding = "10px";
  wrapper.style.backgroundColor = containerStyles.backgroundColor;
  wrapper.style.backgroundImage = containerStyles.backgroundImage;
  wrapper.style.backgroundSize = containerStyles.backgroundSize;
  wrapper.style.backgroundRepeat = containerStyles.backgroundRepeat;
  wrapper.style.display = "inline-block";

  // Build inner content (replace <link> tags with inlined <style>)
  var contentDiv = document.createElement("div");
  // Strip out <link> tags from shadowHTML and replace with <style>
  var cleanHTML = shadowHTML.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, "");
  contentDiv.innerHTML =
    "<style>" + fontFaceCSS + cssTexts.join("\n") + "</style>" + cleanHTML;

  wrapper.appendChild(contentDiv);
  document.body.appendChild(wrapper);

  // Wait a tick for styles/images to apply
  await new Promise(function (resolve) { setTimeout(resolve, 200); });

  try {
    var canvas = await html2canvas(wrapper, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });

    var now = new Date();
    var mm = String(now.getMonth() + 1).padStart(2, "0");
    var dd = String(now.getDate()).padStart(2, "0");
    var yyyy = now.getFullYear();
    var amount = $("input[name='amount']").val() || "0";
    var fileName = mm + "_" + dd + "_" + yyyy + "_" + amount + ".png";

    var link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (e) {
    alert("Download failed: " + e.message);
  } finally {
    document.body.removeChild(wrapper);
  }
}

function initZoomSlider() {
  $("#percentage-slider").on("input", function () {
    var value = $(this).val();
    $("#slider-value").text(value + "%");
    $("#template-container").css("zoom", `${value}%`);
  });
}

function applyUrlParams(template) {
  const params = new URLSearchParams(window.location.search);
  if (params.size === 0) return;

  const config = template.getConfig();

  // Apply texture selection by index (1-based)
  const textureParam = params.get("texture");
  if (textureParam && config.paperTextureList.length > 0) {
    const idx = parseInt(textureParam, 10) - 1;
    if (idx >= 0 && idx < config.paperTextureList.length) {
      const radios = $("#section-paper-texture input[name=texture]");
      radios.eq(idx).prop("checked", true);
    }
  }

  // Apply pump logo selection by index (1-based)
  const pumpLogoParam = params.get("pumpLogo");
  if (pumpLogoParam && config.pumpLogoList.length > 0) {
    const idx = parseInt(pumpLogoParam, 10) - 1;
    if (idx >= 0 && idx < config.pumpLogoList.length) {
      const radios = $("#section-pump-logo input[name=pumpLogo]");
      radios.eq(idx).prop("checked", true);
    }
  }

  // Apply optional fields (e.g. showGST=true or showGST=false)
  config.optionalFieldList.forEach((field) => {
    const val = params.get(field.id);
    if (val !== null) {
      const checkbox = $(`#section-optional-fields input[name="${field.id}"]`);
      checkbox.prop("checked", val === "true" || val === "1");
    }
  });

  // Apply data field values
  config.fieldList.forEach((field) => {
    const val = params.get(field.id);
    if (val !== null) {
      $(`#section-data input[name="${field.id}"]`).val(val);
    }
  });

  // Apply surface
  const surfaceParam = params.get("surface");
  if (surfaceParam) {
    const surfaceVal = "surface-" + surfaceParam;
    const select = $("#surface-select");
    if (select.find(`option[value="${surfaceVal}"]`).length) {
      select.val(surfaceVal).trigger("change");
    }
  }

  // Apply zoom
  const zoomParam = params.get("zoom");
  if (zoomParam) {
    $("#percentage-slider").val(zoomParam).trigger("input");
  }

  // Re-generate preview with applied params
  generate(template);
}
