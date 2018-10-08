/* @flow */

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

    [Symbol.toPrimitive](hint) {
        if(hint == 'number')
            throw new TypeError('OriginDomain instance cannot be coerced into a number!');

        return this.toString();
    }

    get [Symbol.toStringTag]() {
        return 'OriginDomain';
    }
}
