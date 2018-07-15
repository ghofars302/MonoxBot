const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class PrettyDate extends Date {
    constructor(timestamp) {
        super(timestamp);
    }

    GetPrettyDate() {
        return `${days[this.getUTCDay()]}, ${months[this.getUTCMonth()]} ${this.getUTCDate()} ${this.getUTCFullYear()}`;
    }
}

module.exports = (timestamp) => {
    if (!timestamp) throw new Error('Date must not empty');

    return new PrettyDate(timestamp).GetPrettyDate();
}