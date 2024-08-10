export default class NamespacedKey {
    
    /**
     * The namespace representing all inbuilt keys.
     */
    public static readonly DEFAULT = "default";

    public readonly namespace: string;
    public readonly key: string;

    /**
     * Create a key in a specific namespace.
     *
     * @param namespace namespace
     * @param key key
     */
    public constructor(namespace: string, key: string) {
        this.namespace = namespace.lower();
        this.key = key.lower();
    }

    private stringHashCode(str: string): number {
        let hash = 0, i: number, chr: number;
        const length = str.size();
        if (length === 0) return hash;
        for (i = 0; i < length; i++) {
          chr = str.byte(i, i)[0];
          hash = ((hash << 5) - hash) + chr;
          hash |= 0;
        }
        return hash;
      }

    public hashCode(): number {
        let hash = 5;
        hash = 47 * hash + this.stringHashCode(this.namespace);
        hash = 47 * hash + this.stringHashCode(this.key);
        return hash;
    }

    public toString(): string {
        return this.namespace + ":" + this.key;
    }

    /**
     * Get a NamespacedKey from the supplied string with a default namespace if
     * a namespace is not defined. This is a utility method meant to fetch a
     * NamespacedKey from user input. The input contract is as follows:
     * ```
     * fromString("foo", "plugin") // "plugin:foo"
     * fromString("foo:bar", "plugin") // "foo:bar"
     * fromString(":foo", undefined) // "default:foo"
     * fromString("foo", undefined) // "default:foo"
     * fromString("", "plugin") // undefined
     * ```
     *
     * @param string the string to convert to a NamespacedKey
     * @param defaultNamespace the default namespace to use if none was specified
     * @return the created NamespacedKey. undefined if invalid key
     */
    public static fromString(str: string, defaultNamespace?: string) {
        const components = str.lower().split(":");
        const length = components.size();
        if (length > 2) {
            return undefined;
        }

        const key = length === 2 ? components[1] : "";
        if (length === 1) {
            const value = components[0];
            if (value.size() === 0)
                return undefined;
            return new NamespacedKey(defaultNamespace ?? NamespacedKey.DEFAULT, value);
        }
        
        const namespace = components[0];
        if (namespace.size() === 0) {
            return new NamespacedKey(defaultNamespace ?? NamespacedKey.DEFAULT, key);
        }

        return new NamespacedKey(namespace, key);
    }
}