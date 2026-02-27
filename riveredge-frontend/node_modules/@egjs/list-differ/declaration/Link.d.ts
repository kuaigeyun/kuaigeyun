export default class Link {
    prev?: Link;
    next?: Link;
    connect(prevLink?: Link, nextLink?: Link): void;
    disconnect(): void;
    getIndex(): number;
}
