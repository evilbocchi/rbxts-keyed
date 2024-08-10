import Keyed from "./Keyed";
import NamespacedKey from "./NamespacedKey";

export default abstract class Registry<T extends Keyed> {

    public abstract get(key: NamespacedKey): T | undefined;
    public abstract forEach(callbackfn: (value: T, key: NamespacedKey, self: this) => void): void;
    public abstract keys(): NamespacedKey[];
    public abstract values(): T[];

    public match(input: string): T | undefined {
        const [filtered] = input.lower().gsub("\\s+", "_");
        const namespacedKey = NamespacedKey.fromString(filtered);
        return namespacedKey !== undefined ? this.get(namespacedKey) : undefined;
    }
}