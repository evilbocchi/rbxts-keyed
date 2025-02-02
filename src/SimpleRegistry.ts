import Keyed from "./Keyed";
import NamespacedKey from "./NamespacedKey";
import Registry from "./Registry";

type Indexable = { __index: unknown };

export default class SimpleRegistry <T extends Keyed> extends Registry<T> {

    readonly registryType: T;
    readonly map: Map<NamespacedKey, T>;

    constructor(registryType: T, defaultNamespace?: string) {
        super();
        const built = new Map<NamespacedKey, T>();
        const mainClass = ((registryType as unknown) as Indexable).__index; // ahahahaha
        for (const [key, value] of pairs(mainClass as T)) {
            if (typeOf(value) === "table" && (value as Indexable).__index === mainClass) { // cheap hack to get around instanceof limitations
                if ((value as T)["getKey"] === undefined)
                    continue;
                const finalKey = (value as T).getKey() ?? new NamespacedKey(defaultNamespace ?? NamespacedKey.DEFAULT, key as string); // if no key found for getKey then just use the variable's name
                built.set(finalKey, value as T);
            }
        }

        this.map = built;
        this.registryType = registryType;
    }

    public get(key: NamespacedKey): T | undefined {
        for (const [mapKey, value] of this.map) {
            if (mapKey.equals(key) === true)
                return value;
        }
        return undefined;
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