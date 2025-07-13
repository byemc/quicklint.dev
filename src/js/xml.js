
import formatXml from "xml-formatter";

var xmlInput = document.getElementById("xml-input");
var xmlOutput = document.getElementById("xml-output");

const onInputChange = _ => {
    var value = xmlInput.value;
    var output;

    try {
        output = formatXml(value,
            {
                collapseContent: true,
            });
        xmlOutput.classList.remove("is-invalid")

    } catch {
        xmlOutput.classList.add("is-invalid")
        output = xmlOutput.value;
    }

    if (!value) output = "";

    xmlOutput.value = output;
}

xmlInput.addEventListener("input", onInputChange);
