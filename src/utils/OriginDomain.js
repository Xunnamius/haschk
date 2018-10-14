/* @flow */

// TODO: document me!

export default class OriginDomain {
    _originDomain: string = '';

    constructor(originDomain: string = '') {
        this._originDomain = originDomain;
    }

    update(newOriginDomain: string) {
        this._originDomain = newOriginDomain;
    }

    toString() {
        return this._originDomain;
    }

    // flow-disable-line
    [Symbol.toPrimitive](hint) {
        if(hint == 'number')
            throw new TypeError('OriginDomain instance cannot be coerced into a number!');

        return this.toString();
    }

    // flow-disable-line
    get [Symbol.toStringTag]() {
        return 'OriginDomain';
    }
}
