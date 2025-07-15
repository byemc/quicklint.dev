
import formatXml from "xml-formatter";

var xmlInput = document.getElementById("xml-input");
var xmlOutput = document.getElementById("xml-output");

// Settings saving and loading
let defaultSettings = {
    indentation: {
        type: "spaces",
        count: 4
    },
    other: {
        collapseContent: true,
        whiteSpaceAtEndOfSelfclosingTag: false,
        forceSelfClosingEmptyTag: false
    }
}

const getIndentationString = (options = {
    type: "spaces",
    count: 4
}) => {
    switch (options.type) {
        case "tabs":
            return "\t";
        case "spaces":
        default:
            return " ".repeat(options.count ?? defaultSettings.indentation.count)
    }
}

const getSettings = () => {
    document.getElementById("settingsIcon").classList.add("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.remove("bi-gear-wide-connected");

    var settings = JSON.parse(localStorage.getItem("xmlSettings")) ?? defaultSettings;
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

    document.getElementById("collapseContentSwitch").checked = settings.other.collapseContent;
    document.getElementById("whiteSpaceAtEndOfSelfClosingTagSwitch").checked = settings.other.whiteSpaceAtEndOfSelfclosingTag;
    document.getElementById("forceSelfClosingEmptyTagSwitch").checked = settings.other.forceSelfClosingEmptyTag;

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

    var collapseContent = document.getElementById("collapseContentSwitch").checked;
    var whiteSpaceAtEndOfSelfClosingTag = document.getElementById("whiteSpaceAtEndOfSelfClosingTagSwitch").checked;
    var forceSelfClosingEmptyTag = document.getElementById("forceSelfClosingEmptyTagSwitch").checked;

    var settings = {
        indentation: {
            type: indentationType,
            count: indentationNumber
        },
        other: {
            collapseContent,
            whiteSpaceAtEndOfSelfClosingTag,
            forceSelfClosingEmptyTag
        }
    }
    localStorage.setItem("xmlSettings", JSON.stringify(settings));
    onInputChange(settings);

    document.getElementById("settingsIcon").classList.remove("bi-hourglass-split");
    document.getElementById("settingsIcon").classList.add("bi-gear-wide-connected");
}

document.getElementById("indentationTypeTabs").onchange = setSettings;
document.getElementById("indentationTypeSpaces").onchange = setSettings;
document.getElementById("indentationNumber").onchange = setSettings;
document.getElementById("collapseContentSwitch").onchange = setSettings;
document.getElementById("whiteSpaceAtEndOfSelfClosingTagSwitch").onchange = setSettings;
document.getElementById("forceSelfClosingEmptyTagSwitch").onchange = setSettings;

getSettings();

// Functions
const onInputChange = (settings = null) => {
    var value = xmlInput.value;
    var output;

    if (settings === null) {
        settings = getSettings()
    }
    var options = {
        indentation: getIndentationString(settings.indentation),
        collapseContent: settings.other.collapseContent,
        whiteSpaceAtEndOfSelfclosingTag: settings.other.whiteSpaceAtEndOfSelfClosingTag,
        forceSelfClosingEmptyTag: settings.other.forceSelfClosingEmptyTag
    }

    try {
        output = formatXml(value, options);
        xmlOutput.classList.remove("is-invalid")

    } catch {
        xmlOutput.classList.add("is-invalid")
        output = xmlOutput.value;
    }

    if (!value) output = "";

    xmlOutput.value = output;
}

xmlInput.addEventListener("input", _=>onInputChange());
