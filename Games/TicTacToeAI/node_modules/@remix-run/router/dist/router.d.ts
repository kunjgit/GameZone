import type { History, Location, Path, To } from "./history";
import { Action as HistoryAction } from "./history";
import type { DeferredData, AgnosticDataRouteMatch, AgnosticDataRouteObject, FormEncType, FormMethod, DetectErrorBoundaryFunction, RouteData, AgnosticRouteObject, AgnosticRouteMatch, V7_FormMethod, HTMLFormMethod, MapRoutePropertiesFunction } from "./utils";
/**
 * A Router instance manages all navigation and data loading/mutations
 */
export interface Router {
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Return the basename for the router
     */
    get basename(): RouterInit["basename"];
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Return the current state of the router
     */
    get state(): RouterState;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Return the routes for this router instance
     */
    get routes(): AgnosticDataRouteObject[];
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Initialize the router, including adding history listeners and kicking off
     * initial data fetches.  Returns a function to cleanup listeners and abort
     * any in-progress loads
     */
    initialize(): Router;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Subscribe to router.state updates
     *
     * @param fn function to call with the new state
     */
    subscribe(fn: RouterSubscriber): () => void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Enable scroll restoration behavior in the router
     *
     * @param savedScrollPositions Object that will manage positions, in case
     *                             it's being restored from sessionStorage
     * @param getScrollPosition    Function to get the active Y scroll position
     * @param getKey               Function to get the key to use for restoration
     */
    enableScrollRestoration(savedScrollPositions: Record<string, number>, getScrollPosition: GetScrollPositionFunction, getKey?: GetScrollRestorationKeyFunction): () => void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Navigate forward/backward in the history stack
     * @param to Delta to move in the history stack
     */
    navigate(to: number): Promise<void>;
    /**
     * Navigate to the given path
     * @param to Path to navigate to
     * @param opts Navigation options (method, submission, etc.)
     */
    navigate(to: To | null, opts?: RouterNavigateOptions): Promise<void>;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Trigger a fetcher load/submission
     *
     * @param key     Fetcher key
     * @param routeId Route that owns the fetcher
     * @param href    href to fetch
     * @param opts    Fetcher options, (method, submission, etc.)
     */
    fetch(key: string, routeId: string, href: string | null, opts?: RouterNavigateOptions): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Trigger a revalidation of all current route loaders and fetcher loads
     */
    revalidate(): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Utility function to create an href for the given location
     * @param location
     */
    createHref(location: Location | URL): string;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Utility function to URL encode a destination path according to the internal
     * history implementation
     * @param to
     */
    encodeLocation(to: To): Path;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Get/create a fetcher for the given key
     * @param key
     */
    getFetcher<TData = any>(key?: string): Fetcher<TData>;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Delete the fetcher for a given key
     * @param key
     */
    deleteFetcher(key?: string): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Cleanup listeners and abort any in-progress loads
     */
    dispose(): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Get a navigation blocker
     * @param key The identifier for the blocker
     * @param fn The blocker function implementation
     */
    getBlocker(key: string, fn: BlockerFunction): Blocker;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Delete a navigation blocker
     * @param key The identifier for the blocker
     */
    deleteBlocker(key: string): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * HMR needs to pass in-flight route updates to React Router
     * TODO: Replace this with granular route update APIs (addRoute, updateRoute, deleteRoute)
     */
    _internalSetRoutes(routes: AgnosticRouteObject[]): void;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Internal fetch AbortControllers accessed by unit tests
     */
    _internalFetchControllers: Map<string, AbortController>;
    /**
     * @internal
     * PRIVATE - DO NOT USE
     *
     * Internal pending DeferredData instances accessed by unit tests
     */
    _internalActiveDeferreds: Map<string, DeferredData>;
}
/**
 * State maintained internally by the router.  During a navigation, all states
 * reflect the the "old" location unless otherwise noted.
 */
export interface RouterState {
    /**
     * The action of the most recent navigation
     */
    historyAction: HistoryAction;
    /**
     * The current location reflected by the router
     */
    location: Location;
    /**
     * The current set of route matches
     */
    matches: AgnosticDataRouteMatch[];
    /**
     * Tracks whether we've completed our initial data load
     */
    initialized: boolean;
    /**
     * Current scroll position we should start at for a new view
     *  - number -> scroll position to restore to
     *  - false -> do not restore scroll at all (used during submissions)
     *  - null -> don't have a saved position, scroll to hash or top of page
     */
    restoreScrollPosition: number | false | null;
    /**
     * Indicate whether this navigation should skip resetting the scroll position
     * if we are unable to restore the scroll position
     */
    preventScrollReset: boolean;
    /**
     * Tracks the state of the current navigation
     */
    navigation: Navigation;
    /**
     * Tracks any in-progress revalidations
     */
    revalidation: RevalidationState;
    /**
     * Data from the loaders for the current matches
     */
    loaderData: RouteData;
    /**
     * Data from the action for the current matches
     */
    actionData: RouteData | null;
    /**
     * Errors caught from loaders for the current matches
     */
    errors: RouteData | null;
    /**
     * Map of current fetchers
     */
    fetchers: Map<string, Fetcher>;
    /**
     * Map of current blockers
     */
    blockers: Map<string, Blocker>;
}
/**
 * Data that can be passed into hydrate a Router from SSR
 */
export declare type HydrationState = Partial<Pick<RouterState, "loaderData" | "actionData" | "errors">>;
/**
 * Future flags to toggle new feature behavior
 */
export interface FutureConfig {
    v7_normalizeFormMethod: boolean;
    v7_prependBasename: boolean;
}
/**
 * Initialization options for createRouter
 */
export interface RouterInit {
    routes: AgnosticRouteObject[];
    history: History;
    basename?: string;
    /**
     * @deprecated Use `mapRouteProperties` instead
     */
    detectErrorBoundary?: DetectErrorBoundaryFunction;
    mapRouteProperties?: MapRoutePropertiesFunction;
    future?: Partial<FutureConfig>;
    hydrationData?: HydrationState;
    window?: Window;
}
/**
 * State returned from a server-side query() call
 */
export interface StaticHandlerContext {
    basename: Router["basename"];
    location: RouterState["location"];
    matches: RouterState["matches"];
    loaderData: RouterState["loaderData"];
    actionData: RouterState["actionData"];
    errors: RouterState["errors"];
    statusCode: number;
    loaderHeaders: Record<string, Headers>;
    actionHeaders: Record<string, Headers>;
    activeDeferreds: Record<string, DeferredData> | null;
    _deepestRenderedBoundaryId?: string | null;
}
/**
 * A StaticHandler instance manages a singular SSR navigation/fetch event
 */
export interface StaticHandler {
    dataRoutes: AgnosticDataRouteObject[];
    query(request: Request, opts?: {
        requestContext?: unknown;
    }): Promise<StaticHandlerContext | Response>;
    queryRoute(request: Request, opts?: {
        routeId?: string;
        requestContext?: unknown;
    }): Promise<any>;
}
/**
 * Subscriber function signature for changes to router state
 */
export interface RouterSubscriber {
    (state: RouterState): void;
}
interface UseMatchesMatch {
    id: string;
    pathname: string;
    params: AgnosticRouteMatch["params"];
    data: unknown;
    handle: unknown;
}
/**
 * Function signature for determining the key to be used in scroll restoration
 * for a given location
 */
export interface GetScrollRestorationKeyFunction {
    (location: Location, matches: UseMatchesMatch[]): string | null;
}
/**
 * Function signature for determining the current scroll position
 */
export interface GetScrollPositionFunction {
    (): number;
}
export declare type RelativeRoutingType = "route" | "path";
declare type BaseNavigateOptions = {
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: RelativeRoutingType;
    fromRouteId?: string;
};
/**
 * Options for a navigate() call for a Link navigation
 */
declare type LinkNavigateOptions = BaseNavigateOptions;
/**
 * Options for a navigate() call for a Form navigation
 */
declare type SubmissionNavigateOptions = BaseNavigateOptions & {
    formMethod?: HTMLFormMethod;
    formEncType?: FormEncType;
    formData: FormData;
};
/**
 * Options to pass to navigate() for either a Link or Form navigation
 */
export declare type RouterNavigateOptions = LinkNavigateOptions | SubmissionNavigateOptions;
/**
 * Options to pass to fetch()
 */
export declare type RouterFetchOptions = Omit<LinkNavigateOptions, "replace"> | Omit<SubmissionNavigateOptions, "replace">;
/**
 * Potential states for state.navigation
 */
export declare type NavigationStates = {
    Idle: {
        state: "idle";
        location: undefined;
        formMethod: undefined;
        formAction: undefined;
        formEncType: undefined;
        formData: undefined;
    };
    Loading: {
        state: "loading";
        location: Location;
        formMethod: FormMethod | V7_FormMethod | undefined;
        formAction: string | undefined;
        formEncType: FormEncType | undefined;
        formData: FormData | undefined;
    };
    Submitting: {
        state: "submitting";
        location: Location;
        formMethod: FormMethod | V7_FormMethod;
        formAction: string;
        formEncType: FormEncType;
        formData: FormData;
    };
};
export declare type Navigation = NavigationStates[keyof NavigationStates];
export declare type RevalidationState = "idle" | "loading";
/**
 * Potential states for fetchers
 */
declare type FetcherStates<TData = any> = {
    Idle: {
        state: "idle";
        formMethod: undefined;
        formAction: undefined;
        formEncType: undefined;
        formData: undefined;
        data: TData | undefined;
        " _hasFetcherDoneAnything "?: boolean;
    };
    Loading: {
        state: "loading";
        formMethod: FormMethod | V7_FormMethod | undefined;
        formAction: string | undefined;
        formEncType: FormEncType | undefined;
        formData: FormData | undefined;
        data: TData | undefined;
        " _hasFetcherDoneAnything "?: boolean;
    };
    Submitting: {
        state: "submitting";
        formMethod: FormMethod | V7_FormMethod;
        formAction: string;
        formEncType: FormEncType;
        formData: FormData;
        data: TData | undefined;
        " _hasFetcherDoneAnything "?: boolean;
    };
};
export declare type Fetcher<TData = any> = FetcherStates<TData>[keyof FetcherStates<TData>];
interface BlockerBlocked {
    state: "blocked";
    reset(): void;
    proceed(): void;
    location: Location;
}
interface BlockerUnblocked {
    state: "unblocked";
    reset: undefined;
    proceed: undefined;
    location: undefined;
}
interface BlockerProceeding {
    state: "proceeding";
    reset: undefined;
    proceed: undefined;
    location: Location;
}
export declare type Blocker = BlockerUnblocked | BlockerBlocked | BlockerProceeding;
export declare type BlockerFunction = (args: {
    currentLocation: Location;
    nextLocation: Location;
    historyAction: HistoryAction;
}) => boolean;
export declare const IDLE_NAVIGATION: NavigationStates["Idle"];
export declare const IDLE_FETCHER: FetcherStates["Idle"];
export declare const IDLE_BLOCKER: BlockerUnblocked;
/**
 * Create a router and listen to history POP navigations
 */
export declare function createRouter(init: RouterInit): Router;
export declare const UNSAFE_DEFERRED_SYMBOL: unique symbol;
export interface CreateStaticHandlerOptions {
    basename?: string;
    /**
     * @deprecated Use `mapRouteProperties` instead
     */
    detectErrorBoundary?: DetectErrorBoundaryFunction;
    mapRouteProperties?: MapRoutePropertiesFunction;
}
export declare function createStaticHandler(routes: AgnosticRouteObject[], opts?: CreateStaticHandlerOptions): StaticHandler;
/**
 * Given an existing StaticHandlerContext and an error thrown at render time,
 * provide an updated StaticHandlerContext suitable for a second SSR render
 */
export declare function getStaticContextFromError(routes: AgnosticDataRouteObject[], context: StaticHandlerContext, error: any): StaticHandlerContext;
export declare function isDeferredData(value: any): value is DeferredData;
export {};
