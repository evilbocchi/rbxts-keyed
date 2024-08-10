import NamespacedKey from "./NamespacedKey";

interface Keyed {
    getKey(): NamespacedKey;
}

export = Keyed;