import Keyed from "./Keyed";
import NamespacedKey from "./NamespacedKey";
import Registry from "./Registry";

type Indexable = { __index: unknown };

export default class SimpleRegistry <T extends Keyed> extends Registry<T> {

    readonly registryType: T;
    readonly map: Map<NamespacedKey, T>;

    constructor(registryType: T) {
        super();
        const built = new Map<NamespacedKey, T>();
        const mainClass = ((registryType as unknown) as Indexable).__index; // ahahahaha
        for (const [_key, value] of pairs(mainClass as T)) {
            if (typeOf(value) === "table" && (value as Indexable).__index === mainClass) { // cheap hack to get around instanceof limitations
                built.set((value as T).getKey(), value as T);
            }
        }

        this.map = built;
        this.registryType = registryType;
    }

    public get(key: NamespacedKey): T | undefined {
        return this.map.get(key);
    }

    public forEach(callbackfn: (value: T, key: NamespacedKey, self: this) => void): void {
        for (const [key, value] of this.map) {
            callbackfn(value, key, this);
        }
    }

    public keys(): NamespacedKey[] {
        const keys = new Array<NamespacedKey>();
        for (const [key, _value] of this.map) {
            keys.push(key);
        }
        return keys;
    }

    public values(): T[] {
        const values = new Array<T>();
        for (const [_key, value] of this.map) {
            values.push(value);
        }
        return values;
    }
}