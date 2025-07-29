export const getIndentationString = (options = {
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