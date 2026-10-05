export type Token<T> = string | symbol | (new (...args: never[]) => T);
type Factory<T> = (container: Container) => T;

export class Container {
  private readonly bindings = new Map<Token<unknown>, Factory<unknown> | unknown>();
  private readonly singletonTokens = new Set<Token<unknown>>();
  private readonly singletons = new Map<Token<unknown>, unknown>();

  bind<T>(token: Token<T>, factory: Factory<T>, singleton = false): this {
    this.bindings.set(token, factory);
    if (singleton) this.singletonTokens.add(token);
    return this;
  }

  value<T>(token: Token<T>, value: T): this {
    this.bindings.set(token, value);
    this.singletons.set(token, value);
    return this;
  }

  resolve<T>(token: Token<T>): T {
    if (this.singletons.has(token)) return this.singletons.get(token) as T;
    const binding = this.bindings.get(token);
    if (!binding) throw new Error(`No dependency registered for ${String(token)}`);
    const resolved = typeof binding === "function" ? (binding as Factory<T>)(this) : binding as T;
    if (this.singletonTokens.has(token)) this.singletons.set(token, resolved);
    return resolved;
  }
}
