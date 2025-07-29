import {getIndentationString} from "../src/js/indents";
import JSONParser from "./parser";

var jsonInput = document.getElementById("json-input");
var jsonOutput = document.getElementById("json-output");

// Settings saving and loading
let defaultSettings = {
    indentation: {
        type: "spaces",
        count: 4
    },
    other: {
    }
}

const getSettings = () => {
    document.getElementById("settingsIcon").classList.add("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.remove("bi-gear-wide-connected");

    var settings = JSON.parse(localStorage.getItem("jsonSettings")) ?? defaultSettings;
    settings = {...defaultSettings, settings};

    switch (settings.indentation.type) {
        case "tabs":
        default:
            document.getElementById("indentationTypeTabs").checked = true;
            document.getElementById("indentationNumber").disabled = true;
            break;
        case "spaces":
            document.getElementById("indentationTypeSpaces").checked = true;
            document.getElementById("indentationNumber").disabled = false;
            break;
    }
    document.getElementById("indentationNumber").value = settings.indentation.count;
    
    document.getElementById("settingsIcon").classList.remove("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.add("bi-gear-wide-connected");
    return settings;
}

const setSettings = _ => {
    document.getElementById("settingsIcon").classList.add("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.remove("bi-gear-wide-connected");

    var indentationType = document.querySelector("input[name='indentationType']:checked").value;
    switch (indentationType) {
        case "tabs":
        default:
            document.getElementById("indentationNumber").disabled = true;
            break;
        case "spaces":
            document.getElementById("indentationNumber").disabled = false;
            break;
    }
    var indentationNumber = document.getElementById("indentationNumber").value;

    var settings = {
        indentation: {
            type: indentationType,
            count: indentationNumber
        },
        other: {
        }
    }
    localStorage.setItem("jsonSettings", JSON.stringify(settings));
    onInputChange(settings);

    document.getElementById("settingsIcon").classList.remove("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.add("bi-gear-wide-connected");
}

document.getElementById("indentationTypeTabs").onchange = setSettings;
document.getElementById("indentationTypeSpaces").onchange = setSettings;
document.getElementById("indentationNumber").onchange = setSettings;


getSettings();

var parser = new JSONParser();

// Functions
const onInputChange = (settings = null) => {
    var value = jsonInput.value;
    var output;
    document.getElementById("errorList").innerText = "";


    if (settings === null) {
        settings = getSettings()
    }

    if (value === "") {
        jsonOutput.value = "";
        document.getElementById("errorCount").innerText = "";
        jsonOutput.classList.remove("is-invalid");
        return;
    }

    try {
        // TODO: implement the linter.
        if (document.querySelector("input[name='formatterMode']:checked").value === "Minify") {
            output = parser.minify(value);
        } else {
            output = parser.beautify(value);
        }
        jsonOutput.classList.remove("is-invalid");
    } catch (e) {
        jsonOutput.classList.add("is-invalid")
        console.error(e);
        output = {output: jsonOutput.value, errors: [{message: e.toString(), color: "danger"}]};
    } finally {
        if (output.errors)
            jsonOutput.classList.add("is-invalid");
    }

    if (!value) output.output = "";

    document.getElementById("errorCount").innerText = output.errors.length > 0 ? output.errors.length : "";
    for (let i = 0; i < output.errors.length; i++) {
        let error = output.errors[i];

        let li = document.createElement("li");
        li.className = `list-group-item text-bg-${error.color ?? "warning"}`;
        li.innerText = error.message;
        document.getElementById("errorList").appendChild(li)
    }

    jsonOutput.value = output.output;
}

jsonInput.addEventListener("input", _=>onInputChange());
