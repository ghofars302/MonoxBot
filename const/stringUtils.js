class stringUtils {
    constructor(main) {
        this.main = main;
    }

    displayHelpPages(pageNumber) {
        pageNumber = pageNumber || 1;

        if (pageNumber < 1 || pageNumber > this.main.helpPages.length) pageNumber = 1;

        let output = `- MonoxBot command list (Page ${pageNumber} of ${this.main.helpPages.length})`;

        output += `\`\`\`${this.main.helpPages[pageNumber - 1]}\`\`\``;
        output += `To see individual commands, type help <command>`;
        output += `To paginate the Help command react this message`;

        return output;
    }
}

module.exports = stringUtils;