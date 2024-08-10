import NamespacedKey from "./NamespacedKey";

export default interface Keyed {
    getKey(): NamespacedKey;
}