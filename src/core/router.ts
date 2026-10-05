export type RouteHandler<TContext = unknown, TResult = unknown> = (context: TContext) => TResult | Promise<TResult>;

export interface RouteMatch<TContext = unknown> {
  params: Record<string, string>;
  handler: RouteHandler<TContext>;
  pattern: string;
}

interface Route<TContext> {
  method: string;
  pattern: string;
  expression: RegExp;
  keys: string[];
  handler: RouteHandler<TContext>;
}

function compilePattern(pattern: string): Pick<Route<unknown>, "expression" | "keys"> {
  const keys: string[] = [];
  const source = pattern.split("/").map((segment) => {
    if (segment.startsWith(":")) {
      keys.push(segment.slice(1));
      return "([^/]+)";
    }
    if (segment === "*") {
      keys.push("wildcard");
      return "(.*)";
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  return { expression: new RegExp(`^${source}/?$`), keys };
}

export class Router<TContext = unknown> {
  private readonly routes: Route<TContext>[] = [];

  on(method: string, pattern: string, handler: RouteHandler<TContext>): this {
    const compiled = compilePattern(pattern);
    this.routes.push({ method: method.toUpperCase(), pattern, handler, ...compiled });
    return this;
  }

  match(method: string, path: string): RouteMatch<TContext> | undefined {
    const candidate = this.routes.find((route) => route.method === method.toUpperCase() && route.expression.test(path));
    if (!candidate) return undefined;
    const values = candidate.expression.exec(path)?.slice(1) ?? [];
    return {
      params: Object.fromEntries(candidate.keys.map((key, index) => [key, decodeURIComponent(values[index] ?? "")])),
      handler: candidate.handler,
      pattern: candidate.pattern,
    };
  }

  async dispatch(method: string, path: string, context: TContext): Promise<unknown> {
    const match = this.match(method, path);
    if (!match) throw new Error(`Route not found: ${method.toUpperCase()} ${path}`);
    return match.handler(context);
  }
}
