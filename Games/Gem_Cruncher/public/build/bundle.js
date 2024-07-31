
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next, lookup.has(block.key));
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.21.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function flip(node, animation, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\components\Tile.svelte generated by Svelte v3.21.0 */
    const file = "src\\components\\Tile.svelte";

    function create_fragment(ctx) {
    	let div;
    	let div_class_value;
    	let div_draggable_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_style(div, "--tile-size", /*size*/ ctx[1] + "px");
    			attr_dev(div, "class", div_class_value = "tile tile-" + /*type*/ ctx[0] + " special-" + /*special*/ ctx[2] + " svelte-rudbdh");
    			attr_dev(div, "draggable", div_draggable_value = true);
    			toggle_class(div, "is-selected", /*selected*/ ctx[3] || /*isSwiping*/ ctx[4]);
    			add_location(div, file, 109, 0, 2377);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(div, "touchstart", /*handleTouchStart*/ ctx[5], false, false, false),
    				listen_dev(div, "touchmove", /*handleTouchMove*/ ctx[6], false, false, false),
    				listen_dev(div, "touchend", /*handleTouchEnd*/ ctx[7], { passive: true }, false, false),
    				listen_dev(div, "dragstart", /*handleDragStart*/ ctx[8], false, false, false),
    				listen_dev(div, "dragend", /*handleDragEnd*/ ctx[10], false, false, false),
    				listen_dev(div, "drag", /*handleDrag*/ ctx[9], false, false, false),
    				listen_dev(div, "click", /*click_handler*/ ctx[21], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 524288) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[19], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null));
    				}
    			}

    			if (!current || dirty & /*size*/ 2) {
    				set_style(div, "--tile-size", /*size*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*type, special*/ 5 && div_class_value !== (div_class_value = "tile tile-" + /*type*/ ctx[0] + " special-" + /*special*/ ctx[2] + " svelte-rudbdh")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*type, special, selected, isSwiping*/ 29) {
    				toggle_class(div, "is-selected", /*selected*/ ctx[3] || /*isSwiping*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				if (!div_intro) div_intro = create_in_transition(div, fly, {
    					duration: 250,
    					delay: 100,
    					y: -100,
    					opacity: 0
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, scale, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { type } = $$props;
    	let { index } = $$props;
    	let { size } = $$props;
    	let { special } = $$props;
    	let { selected = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const dragGhost = new Image(0, 0);
    	dragGhost.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    	let SWIPE_THRESHOLD = size - 10;
    	let isSwiping = false;
    	let xDown;
    	let yDown;
    	let xDiff;
    	let yDiff;

    	function handleTouchStart(event) {
    		$$invalidate(4, isSwiping = true);
    		xDown = event.touches ? event.touches[0].clientX : event.clientX;
    		yDown = event.touches ? event.touches[0].clientY : event.clientY;
    		xDiff = 0;
    		yDiff = 0;
    	}

    	function handleTouchMove(event) {
    		if (!isSwiping) return;
    		const xUp = event.touches ? event.touches[0].clientX : event.clientX;
    		const yUp = event.touches ? event.touches[0].clientY : event.clientY;
    		let direction;
    		xDiff = xDown - xUp;
    		yDiff = yDown - yUp;

    		if (xDiff < -SWIPE_THRESHOLD) {
    			direction = "right";
    		} else if (xDiff > SWIPE_THRESHOLD) {
    			direction = "left";
    		} else if (yDiff < -SWIPE_THRESHOLD) {
    			direction = "down";
    		} else if (yDiff > SWIPE_THRESHOLD) {
    			direction = "up";
    		}

    		if (direction) {
    			dispatch("swipe", { direction, index });
    			$$invalidate(4, isSwiping = false);
    		}
    	}

    	function handleTouchEnd() {
    		$$invalidate(4, isSwiping = false);
    	}

    	function handleDragStart(event) {
    		event.dataTransfer.setDragImage(dragGhost, 0, 0);
    		handleTouchStart(event);
    	}

    	function handleDrag(event) {
    		handleTouchMove(event);
    	}

    	function handleDragEnd() {
    		handleTouchEnd();
    	}

    	const writable_props = ["type", "index", "size", "special", "selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tile> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tile", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("index" in $$props) $$invalidate(11, index = $$props.index);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("special" in $$props) $$invalidate(2, special = $$props.special);
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    		if ("$$scope" in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fly,
    		scale,
    		type,
    		index,
    		size,
    		special,
    		selected,
    		dispatch,
    		dragGhost,
    		SWIPE_THRESHOLD,
    		isSwiping,
    		xDown,
    		yDown,
    		xDiff,
    		yDiff,
    		handleTouchStart,
    		handleTouchMove,
    		handleTouchEnd,
    		handleDragStart,
    		handleDrag,
    		handleDragEnd
    	});

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("index" in $$props) $$invalidate(11, index = $$props.index);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("special" in $$props) $$invalidate(2, special = $$props.special);
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    		if ("SWIPE_THRESHOLD" in $$props) SWIPE_THRESHOLD = $$props.SWIPE_THRESHOLD;
    		if ("isSwiping" in $$props) $$invalidate(4, isSwiping = $$props.isSwiping);
    		if ("xDown" in $$props) xDown = $$props.xDown;
    		if ("yDown" in $$props) yDown = $$props.yDown;
    		if ("xDiff" in $$props) xDiff = $$props.xDiff;
    		if ("yDiff" in $$props) yDiff = $$props.yDiff;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		type,
    		size,
    		special,
    		selected,
    		isSwiping,
    		handleTouchStart,
    		handleTouchMove,
    		handleTouchEnd,
    		handleDragStart,
    		handleDrag,
    		handleDragEnd,
    		index,
    		dragGhost,
    		xDown,
    		yDown,
    		xDiff,
    		yDiff,
    		dispatch,
    		SWIPE_THRESHOLD,
    		$$scope,
    		$$slots,
    		click_handler
    	];
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			type: 0,
    			index: 11,
    			size: 1,
    			special: 2,
    			selected: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tile",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
    			console.warn("<Tile> was created without expected prop 'type'");
    		}

    		if (/*index*/ ctx[11] === undefined && !("index" in props)) {
    			console.warn("<Tile> was created without expected prop 'index'");
    		}

    		if (/*size*/ ctx[1] === undefined && !("size" in props)) {
    			console.warn("<Tile> was created without expected prop 'size'");
    		}

    		if (/*special*/ ctx[2] === undefined && !("special" in props)) {
    			console.warn("<Tile> was created without expected prop 'special'");
    		}
    	}

    	get type() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get special() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set special(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    // TODO: Check if there's a better way to generate unique IDs without relying on this
    // variable, which makes it basically a singleton.
    let lastTileID = 0;
    function generateRandomTile() {
      lastTileID += 1;

      return {
        id: lastTileID,
        type: Math.floor(Math.random() * 5) + 1,
      }
    }

    /**
     * Generates a game board as a flat array of rows * columns elements,
     * each tile is randomly generated.
     *
     * @param {int} rows
     * @param {int} columns
     * @returns {array}
     */
    function generateRandomBoard(rows, columns) {
      const size = rows * columns;
      let board = [];

      for (let i = 0; i < size; i += 1) {
        board[i] = generateRandomTile();
      }

      let matches = getMatches(board, rows, columns);

      while (matches.length > 0) {
        board = getResolvedBoard(board, rows, columns);
        matches = getMatches(board, rows, columns);
      }

      return board
    }

    /**
     * Returns x and y coordiates for tile at index.
     *
     * @param {int} index
     * @param {int} columns
     * @retunrs {object}
     */
    function getCoordinates(index, columns) {
      return {
        x: index % columns,
        y: Math.floor(index / columns),
      }
    }

    /**
     * Returns true if the tiles at indexes p and q are adjacent.
     *
     * @param {int} p
     * @param {int} q
     * @param {int} columns
     * @returns {boolean}
     */
    function areTilesAdjacent(p, q, columns) {
      const pCoords = getCoordinates(p, columns);
      const qCoords = getCoordinates(q, columns);

      return (
        (pCoords.x === qCoords.x && Math.abs(pCoords.y - qCoords.y) === 1) ||
        (pCoords.y === qCoords.y && Math.abs(pCoords.x - qCoords.x) === 1)
      )
    }

    const BASE_SCORE = 60;

    function getBoardScore(board, rows, columns, chainMultiplier) {
      const matches = getMatches(board, rows, columns);
      let score = 0;

      matches.forEach((match) => {
        const tileMultiplier = match.indices.length - 2;
        return (score += BASE_SCORE * tileMultiplier * chainMultiplier)
      });

      return score
    }

    function getClearedBoard(board, rows, columns) {
      const matches = getMatches(board, rows, columns);
      const clearedBoard = [...board];

      if (matches.length === 0) {
        return board
      }

      matches.forEach((match) => {
        match.indices.forEach((index) => {
          clearedBoard[index].type = null;
        });
      });

      return clearedBoard
    }

    function getResolvedBoard(board, rows, columns) {
      const clearedBoard = getClearedBoard(board, rows, columns);
      const resolvedBoard = [...board];
      let emptyTiles = [];

      // Drop tiles to fill empty spaces
      for (let i = 0; i < columns; i += 1) {
        const colEmptyTiles = [];
        for (let j = rows - 1; j > -1; j -= 1) {
          const index = j * columns + i;
          if (resolvedBoard[index].type === null) {
            colEmptyTiles.push(index);
          } else if (colEmptyTiles.length > 0) {
            const firstEmptyTile = colEmptyTiles.shift();
            const aux = resolvedBoard[firstEmptyTile];
            resolvedBoard[firstEmptyTile] = resolvedBoard[index];
            resolvedBoard[index] = aux;
            colEmptyTiles.push(index);
          }
        }

        emptyTiles = [...emptyTiles, ...colEmptyTiles];
      }

      emptyTiles.forEach((index) => {
        resolvedBoard[index] = generateRandomTile();
      });

      return resolvedBoard
    }

    function getMatches(board, rows, columns, minMatch = 3) {
      const hMatches = getHorizontalMatches(board, rows, columns, minMatch);
      const vMatches = getVerticalMatches(board, rows, columns, minMatch);

      return [...hMatches, ...vMatches]
    }

    function getHorizontalMatches(board, rows, columns, minMatch = 3) {
      const matches = [];

      for (let i = 0; i < rows; i += 1) {
        let matchLength = 1;
        for (let j = 0; j < columns; j += 1) {
          const index = i * columns + j;
          let checkMatch = false;

          if (j === columns - 1) {
            // Last tile in the row
            checkMatch = true;
          } else {
            if (board[index].type === board[index + 1].type) {
              matchLength += 1;
            } else {
              checkMatch = true;
            }
          }

          if (checkMatch) {
            if (matchLength >= minMatch) {
              // add match to arraw of matches
              const start = index + 1 - matchLength;
              const end = index;
              matches.push({
                start,
                end,
                indices: getIndices(start, end),
                length: matchLength,
                orientation: 'horizontal',
              });
            }

            matchLength = 1;
          }
        }
      }

      return matches
    }

    function getVerticalMatches(board, rows, columns, minMatch = 3) {
      const matches = [];

      for (let i = 0; i < columns; i += 1) {
        let matchLength = 1;
        for (let j = 0; j < rows; j += 1) {
          const index = j * columns + i;
          let checkMatch = false;

          if (j === rows - 1) {
            // Last tile in the column
            checkMatch = true;
          } else {
            if (board[index].type === board[index + columns].type) {
              matchLength += 1;
            } else {
              checkMatch = true;
            }
          }

          if (checkMatch) {
            if (matchLength >= minMatch) {
              // add match to arraw of matches
              const start = index - (matchLength - 1) * columns;
              const end = index;
              matches.push({
                start,
                end,
                indices: getIndices(start, end, columns),
                length: matchLength,
                orientation: 'vertical',
              });
            }

            matchLength = 1;
          }
        }
      }

      return matches
    }

    function getIndices(start, end, step = 1) {
      const indices = [];
      let index = start;

      while (index <= end) {
        indices.push(index);
        index += step;
      }

      return indices
    }

    const init$1 = (rows, columns, moves) => (state) => {
      return {
        rows,
        columns,
        board: generateRandomBoard(rows, columns),
        startingMoves: moves,
        moves,
        score: 0,
      }
    };

    const reset = () => (state) => {
      return {
        ...state,
        board: generateRandomBoard(state.rows, state.columns),
        moves: state.startingMoves,
        score: 0,
      }
    };

    const swapTiles = (p, q) => (state) => {
      const { board } = state;
      const aux = board[p];
      board[p] = board[q];
      board[q] = aux;

      return {
        ...state,
        board,
      }
    };

    const decrementMoves = () => (state) => {
      return {
        ...state,
        moves: state.moves - 1,
      }
    };

    const clearBoard = () => (state) => {
      const { board, rows, columns } = state;
      const clearedBoard = getClearedBoard(board, rows, columns);

      return {
        ...state,
        board: clearedBoard,
      }
    };

    const resolveBoard = () => (state) => {
      const { board, rows, columns } = state;
      const resolvedBoard = getResolvedBoard(board, rows, columns);

      return {
        ...state,
        board: resolvedBoard,
      }
    };

    const scoreBoard = (chainMultiplier) => (state) => {
      const { board, rows, columns, score } = state;
      const newScore = getBoardScore(board, rows, columns, chainMultiplier) + score;

      return {
        ...state,
        score: newScore,
      }
    };

    const checkMatchesAndResolve = (resolveCb, onMatch, onFinish, n) => (
      state
    ) => {
      const { board, rows, columns } = state;
      const matches = getMatches(board, rows, columns);
      if (matches.length > 0) {
        resolveCb(onMatch, onFinish, n + 1);
      } else {
        onFinish();
      }

      return state
    };

    function createStore() {
      const { subscribe, update } = writable({});

      return {
        subscribe,
        update,
        init: (rows, columns, moves) => update(init$1(rows, columns, moves)),
        reset: () => update(reset()),
        swapTiles: (p, q) => update(swapTiles(p, q)),
        decrementMoves: () => update(decrementMoves()),
        resolveBoard: function doResolve(onMatch, onFinish, n = 1) {
          update(clearBoard());
          setTimeout(() => {
            update(scoreBoard(n));
            update(resolveBoard());
            onMatch();
            setTimeout(() => {
              update(checkMatchesAndResolve(doResolve, onMatch, onFinish, n));
            }, 350);
          }, 200);
        },
      }
    }

    var game = createStore();

    /* src\components\Board.svelte generated by Svelte v3.21.0 */
    const file$1 = "src\\components\\Board.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (208:8) {#if tile.type !== null}
    function create_if_block(ctx) {
    	let current;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[17](/*i*/ ctx[20], ...args);
    	}

    	const tile = new Tile({
    			props: {
    				type: /*tile*/ ctx[21].type,
    				special: /*tile*/ ctx[21].special,
    				size: /*tileSize*/ ctx[0],
    				index: /*i*/ ctx[20],
    				selected: /*isTileSelected*/ ctx[3](/*i*/ ctx[20])
    			},
    			$$inline: true
    		});

    	tile.$on("click", click_handler);
    	tile.$on("swipe", /*handleSwipe*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tile_changes = {};
    			if (dirty & /*board*/ 2) tile_changes.type = /*tile*/ ctx[21].type;
    			if (dirty & /*board*/ 2) tile_changes.special = /*tile*/ ctx[21].special;
    			if (dirty & /*tileSize*/ 1) tile_changes.size = /*tileSize*/ ctx[0];
    			if (dirty & /*board*/ 2) tile_changes.index = /*i*/ ctx[20];
    			if (dirty & /*isTileSelected, board*/ 10) tile_changes.selected = /*isTileSelected*/ ctx[3](/*i*/ ctx[20]);
    			tile.$set(tile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(208:8) {#if tile.type !== null}",
    		ctx
    	});

    	return block;
    }

    // (203:4) {#each board as tile, i (tile.id)}
    function create_each_block_1(key_1, ctx) {
    	let span;
    	let span_style_value;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let if_block = /*tile*/ ctx[21].type !== null && create_if_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "tile-wrapper svelte-lfzdol");
    			attr_dev(span, "style", span_style_value = /*getCellStyle*/ ctx[4](/*i*/ ctx[20]));
    			add_location(span, file$1, 203, 6, 4682);
    			this.first = span;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*tile*/ ctx[21].type !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*board*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*getCellStyle, board*/ 18 && span_style_value !== (span_style_value = /*getCellStyle*/ ctx[4](/*i*/ ctx[20]))) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		r: function measure() {
    			rect = span.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(span);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();

    			stop_animation = create_animation(span, rect, flip, {
    				delay: 0,
    				duration: 250,
    				easing: quintOut
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(203:4) {#each board as tile, i (tile.id)}",
    		ctx
    	});

    	return block;
    }

    // (220:4) {#each cells as cell, i}
    function create_each_block(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "cell svelte-lfzdol");
    			attr_dev(div, "style", div_style_value = /*getCellStyle*/ ctx[4](/*cell*/ ctx[18]));
    			toggle_class(div, "is-selected", /*isTileSelected*/ ctx[3](/*i*/ ctx[20]));
    			add_location(div, file$1, 220, 6, 5184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getCellStyle, cells*/ 20 && div_style_value !== (div_style_value = /*getCellStyle*/ ctx[4](/*cell*/ ctx[18]))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*isTileSelected*/ 8) {
    				toggle_class(div, "is-selected", /*isTileSelected*/ ctx[3](/*i*/ ctx[20]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(220:4) {#each cells as cell, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t;
    	let current;
    	let each_value_1 = /*board*/ ctx[1];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*tile*/ ctx[21].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*cells*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "board svelte-lfzdol");
    			attr_dev(div, "style", /*boardStyle*/ ctx[5]);
    			add_location(div, file$1, 201, 2, 4598);
    			attr_dev(main, "class", "svelte-lfzdol");
    			add_location(main, file$1, 200, 0, 4589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div, null);
    			}

    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getCellStyle, board, tileSize, isTileSelected, handleTileClick, handleSwipe*/ 219) {
    				const each_value_1 = /*board*/ ctx[1];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div, fix_and_outro_and_destroy_block, create_each_block_1, t, get_each_context_1);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
    				check_outros();
    			}

    			if (dirty & /*getCellStyle, cells, isTileSelected*/ 28) {
    				each_value = /*cells*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*boardStyle*/ 32) {
    				attr_dev(div, "style", /*boardStyle*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BOARD_PADDING = 10;

    function instance$1($$self, $$props, $$invalidate) {
    	let $game;
    	validate_store(game, "game");
    	component_subscribe($$self, game, $$value => $$invalidate(10, $game = $$value));
    	const dispatch = createEventDispatcher();
    	const matchSound = new Audio("/assets/match.wav");
    	let docWidth = document.body.clientWidth;
    	let tileSize = getTileSize($game.columns);

    	function getTileSize(columns) {
    		docWidth = document.body.clientWidth;
    		let minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 60;

    		if (docWidth >= minWdth) {
    			return 60;
    		}

    		minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 50;

    		if (docWidth >= minWdth) {
    			return 50;
    		}

    		minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 40;

    		if (docWidth >= minWdth) {
    			return 40;
    		}

    		minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 30;

    		if (docWidth >= minWdth) {
    			return 30;
    		}

    		minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 20;

    		if (docWidth >= minWdth) {
    			return 20;
    		}

    		return 10;
    	}

    	function swapTiles(p, q) {
    		game.swapTiles(p, q);

    		setTimeout(
    			() => {
    				const matches = getMatches(board, rows, columns);

    				if (matches.length === 0) {
    					game.swapTiles(p, q);
    				} else {
    					game.decrementMoves();

    					game.resolveBoard(
    						() => {
    							matchSound.currentTime = 0;
    							matchSound.play();
    						},
    						() => {
    							if ($game.moves === 0) {
    								dispatch("game-over", { score: $game.score });
    							}
    						}
    					);
    				}
    			},
    			250 - 50
    		);

    		$$invalidate(13, selectedTile = null);
    	}

    	function handleTileClick(i) {
    		if (isTileSelected(i)) {
    			return $$invalidate(13, selectedTile = null);
    		}

    		if (selectedTile === null) {
    			return $$invalidate(13, selectedTile = i);
    		}

    		if (!areTilesAdjacent(selectedTile, i, columns)) {
    			return $$invalidate(13, selectedTile = null);
    		}

    		swapTiles(selectedTile, i);
    	}

    	function handleSwipe(event) {
    		const { direction, index } = event.detail;

    		switch (direction) {
    			case "left":
    				// can't swipe left from first column
    				if (index % columns === 0) {
    					return;
    				}
    				return swapTiles(index, index - 1);
    			case "right":
    				// can't swipe right from last column
    				if (index % columns === columns - 1) {
    					return;
    				}
    				return swapTiles(index, index + 1);
    			case "up":
    				// can't swipe up from first row
    				if (index < columns) {
    					return;
    				}
    				return swapTiles(index, index - columns);
    			case "down":
    				// can't swipe down from last row
    				if (index + columns >= board.length) {
    					return;
    				}
    				return swapTiles(index, index + columns);
    			default:
    				return;
    		}
    	}

    	onMount(() => {
    		window.addEventListener("resize", () => {
    			requestAnimationFrame(() => {
    				const newTileSize = getTileSize($game.columns);

    				if (newTileSize !== tileSize) {
    					$$invalidate(0, tileSize = newTileSize);
    				}
    			});
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Board", $$slots, []);
    	const click_handler = i => handleTileClick(i);

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		flip,
    		quintOut,
    		Tile,
    		game,
    		areTilesAdjacent,
    		getMatches,
    		BOARD_PADDING,
    		dispatch,
    		matchSound,
    		docWidth,
    		tileSize,
    		getTileSize,
    		swapTiles,
    		handleTileClick,
    		handleSwipe,
    		$game,
    		board,
    		rows,
    		columns,
    		cells,
    		selectedTile,
    		isTileSelected,
    		getCellStyle,
    		boardStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("docWidth" in $$props) docWidth = $$props.docWidth;
    		if ("tileSize" in $$props) $$invalidate(0, tileSize = $$props.tileSize);
    		if ("board" in $$props) $$invalidate(1, board = $$props.board);
    		if ("rows" in $$props) $$invalidate(11, rows = $$props.rows);
    		if ("columns" in $$props) $$invalidate(12, columns = $$props.columns);
    		if ("cells" in $$props) $$invalidate(2, cells = $$props.cells);
    		if ("selectedTile" in $$props) $$invalidate(13, selectedTile = $$props.selectedTile);
    		if ("isTileSelected" in $$props) $$invalidate(3, isTileSelected = $$props.isTileSelected);
    		if ("getCellStyle" in $$props) $$invalidate(4, getCellStyle = $$props.getCellStyle);
    		if ("boardStyle" in $$props) $$invalidate(5, boardStyle = $$props.boardStyle);
    	};

    	let board;
    	let rows;
    	let columns;
    	let cells;
    	let selectedTile;
    	let isTileSelected;
    	let getCellStyle;
    	let boardStyle;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$game*/ 1024) {
    			 $$invalidate(1, board = $game.board);
    		}

    		if ($$self.$$.dirty & /*$game*/ 1024) {
    			 $$invalidate(11, rows = $game.rows);
    		}

    		if ($$self.$$.dirty & /*$game*/ 1024) {
    			 $$invalidate(12, columns = $game.columns);
    		}

    		if ($$self.$$.dirty & /*board*/ 2) {
    			 $$invalidate(2, cells = [...Array(board.length).keys()]);
    		}

    		if ($$self.$$.dirty & /*selectedTile*/ 8192) {
    			 $$invalidate(3, isTileSelected = i => selectedTile === i);
    		}

    		if ($$self.$$.dirty & /*columns, tileSize*/ 4097) {
    			 $$invalidate(4, getCellStyle = i => {
    				const row = Math.floor(i / columns);
    				const col = i % columns;

    				return `
      top: ${tileSize * row + BOARD_PADDING}px;
      left: ${tileSize * col + BOARD_PADDING}px;
    `;
    			});
    		}

    		if ($$self.$$.dirty & /*tileSize, columns, rows*/ 6145) {
    			 $$invalidate(5, boardStyle = `
    width: ${tileSize * columns + BOARD_PADDING * 2}px;
    height: ${tileSize * rows + BOARD_PADDING * 2}px;
    --tile-size: ${tileSize}px;
  `);
    		}
    	};

    	 $$invalidate(13, selectedTile = null);

    	return [
    		tileSize,
    		board,
    		cells,
    		isTileSelected,
    		getCellStyle,
    		boardStyle,
    		handleTileClick,
    		handleSwipe,
    		matchSound,
    		docWidth,
    		$game,
    		rows,
    		columns,
    		selectedTile,
    		dispatch,
    		getTileSize,
    		swapTiles,
    		click_handler
    	];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\GameHeader.svelte generated by Svelte v3.21.0 */
    const file$2 = "src\\components\\GameHeader.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*$game*/ ctx[0].moves + "";
    	let t2;
    	let t3;
    	let div5;
    	let div3;
    	let t5;
    	let div4;
    	let t6_value = /*$game*/ ctx[0].score + "";
    	let t6;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Moves";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Score";
    			t5 = space();
    			div4 = element("div");
    			t6 = text(t6_value);
    			attr_dev(div0, "class", "group-label");
    			add_location(div0, file$2, 55, 4, 903);
    			attr_dev(div1, "class", "group-value svelte-87os51");
    			add_location(div1, file$2, 56, 4, 944);
    			attr_dev(div2, "class", "group moves svelte-87os51");
    			add_location(div2, file$2, 54, 2, 873);
    			attr_dev(div3, "class", "group-label");
    			add_location(div3, file$2, 59, 4, 1030);
    			attr_dev(div4, "class", "group-value svelte-87os51");
    			add_location(div4, file$2, 60, 4, 1071);
    			attr_dev(div5, "class", "group score svelte-87os51");
    			add_location(div5, file$2, 58, 2, 1000);
    			attr_dev(header, "class", "svelte-87os51");
    			add_location(header, file$2, 53, 0, 862);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(header, t3);
    			append_dev(header, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$game*/ 1 && t2_value !== (t2_value = /*$game*/ ctx[0].moves + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$game*/ 1 && t6_value !== (t6_value = /*$game*/ ctx[0].score + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $game;
    	validate_store(game, "game");
    	component_subscribe($$self, game, $$value => $$invalidate(0, $game = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameHeader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameHeader", $$slots, []);
    	$$self.$capture_state = () => ({ game, $game });
    	return [$game];
    }

    class GameHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameHeader",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Button.svelte generated by Svelte v3.21.0 */

    const file$3 = "src\\components\\Button.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-1m9iqve");
    			add_location(button, file$3, 36, 0, 679);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\GameFooter.svelte generated by Svelte v3.21.0 */
    const file$4 = "src\\components\\GameFooter.svelte";

    // (38:2) <Button on:click={game.reset}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Reset");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(38:2) <Button on:click={game.reset}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let footer;
    	let current;

    	const button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", game.reset);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(button.$$.fragment);
    			attr_dev(footer, "class", "svelte-1c81l3p");
    			add_location(footer, file$4, 36, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(button, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameFooter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameFooter", $$slots, []);
    	$$self.$capture_state = () => ({ Button, game });
    	return [];
    }

    class GameFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameFooter",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\GameOverModal.svelte generated by Svelte v3.21.0 */
    const file$5 = "src\\components\\GameOverModal.svelte";

    // (62:4) <Button on:click={() => dispatch('play-again')}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Play Again");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(62:4) <Button on:click={() => dispatch('play-again')}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let t6;
    	let current;

    	const button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "Game Over";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*score*/ ctx[1]);
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Best: ");
    			t5 = text(/*bestScore*/ ctx[2]);
    			t6 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "title svelte-1kzjg8m");
    			add_location(div0, file$5, 58, 4, 1076);
    			attr_dev(div1, "class", "score svelte-1kzjg8m");
    			add_location(div1, file$5, 59, 4, 1115);
    			attr_dev(div2, "class", "best-score svelte-1kzjg8m");
    			add_location(div2, file$5, 60, 4, 1152);
    			attr_dev(div3, "class", "modal svelte-1kzjg8m");
    			add_location(div3, file$5, 57, 2, 1052);
    			attr_dev(div4, "class", "overlay svelte-1kzjg8m");
    			toggle_class(div4, "visible", /*visible*/ ctx[0]);
    			add_location(div4, file$5, 56, 0, 1014);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div2, t5);
    			append_dev(div3, t6);
    			mount_component(button, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*score*/ 2) set_data_dev(t2, /*score*/ ctx[1]);
    			if (!current || dirty & /*bestScore*/ 4) set_data_dev(t5, /*bestScore*/ ctx[2]);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*visible*/ 1) {
    				toggle_class(div4, "visible", /*visible*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { visible = false } = $$props;
    	let { score = "" } = $$props;
    	let { bestScore = "" } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ["visible", "score", "bestScore"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameOverModal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameOverModal", $$slots, []);
    	const click_handler = () => dispatch("play-again");

    	$$self.$set = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("bestScore" in $$props) $$invalidate(2, bestScore = $$props.bestScore);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		visible,
    		score,
    		bestScore,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("bestScore" in $$props) $$invalidate(2, bestScore = $$props.bestScore);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, score, bestScore, dispatch, click_handler];
    }

    class GameOverModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { visible: 0, score: 1, bestScore: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOverModal",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get visible() {
    		throw new Error("<GameOverModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<GameOverModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get score() {
    		throw new Error("<GameOverModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<GameOverModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bestScore() {
    		throw new Error("<GameOverModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bestScore(value) {
    		throw new Error("<GameOverModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Game.svelte generated by Svelte v3.21.0 */
    const file$6 = "src\\components\\Game.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let div;
    	let current;
    	const gameheader = new GameHeader({ $$inline: true });
    	const board = new Board({ $$inline: true });
    	board.$on("game-over", /*handleGameOver*/ ctx[3]);
    	const gamefooter = new GameFooter({ $$inline: true });

    	const gameovermodal = new GameOverModal({
    			props: {
    				score: /*score*/ ctx[2],
    				bestScore: /*bestScore*/ ctx[1],
    				visible: /*showModal*/ ctx[0]
    			},
    			$$inline: true
    		});

    	gameovermodal.$on("play-again", /*handlePlayAgain*/ ctx[4]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(gameheader.$$.fragment);
    			t0 = space();
    			create_component(board.$$.fragment);
    			t1 = space();
    			create_component(gamefooter.$$.fragment);
    			t2 = space();
    			create_component(gameovermodal.$$.fragment);
    			t3 = space();
    			div = element("div");
    			div.textContent = "Please rotate phone 😄";
    			attr_dev(main, "class", "svelte-1vyypha");
    			add_location(main, file$6, 86, 0, 1894);
    			attr_dev(div, "class", "please-rotate svelte-1vyypha");
    			add_location(div, file$6, 97, 0, 2094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(gameheader, main, null);
    			append_dev(main, t0);
    			mount_component(board, main, null);
    			append_dev(main, t1);
    			mount_component(gamefooter, main, null);
    			append_dev(main, t2);
    			mount_component(gameovermodal, main, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gameovermodal_changes = {};
    			if (dirty & /*score*/ 4) gameovermodal_changes.score = /*score*/ ctx[2];
    			if (dirty & /*bestScore*/ 2) gameovermodal_changes.bestScore = /*bestScore*/ ctx[1];
    			if (dirty & /*showModal*/ 1) gameovermodal_changes.visible = /*showModal*/ ctx[0];
    			gameovermodal.$set(gameovermodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameheader.$$.fragment, local);
    			transition_in(board.$$.fragment, local);
    			transition_in(gamefooter.$$.fragment, local);
    			transition_in(gameovermodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameheader.$$.fragment, local);
    			transition_out(board.$$.fragment, local);
    			transition_out(gamefooter.$$.fragment, local);
    			transition_out(gameovermodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(gameheader);
    			destroy_component(board);
    			destroy_component(gamefooter);
    			destroy_component(gameovermodal);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const moves = 20;

    function getInitialBoardSize() {
    	const docWidth = document.body.clientWidth;
    	const docHeight = document.body.clientHeight;
    	let rows = 8;
    	let columns = 7;

    	if (docWidth >= 700) {
    		columns = 10;
    	} else if (docWidth >= 580) {
    		columns = 8;
    	}

    	return { rows, columns };
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $game;
    	validate_store(game, "game");
    	component_subscribe($$self, game, $$value => $$invalidate(5, $game = $$value));
    	const { rows, columns } = getInitialBoardSize();
    	game.init(rows, columns, moves);
    	let showModal = false;
    	let bestScore;
    	let score;

    	function handleGameOver(event) {
    		$$invalidate(2, score = $game.score);
    		const prevBest = localStorage.getItem("best-score") || 0;
    		const newBest = Math.max(score, parseInt(prevBest, 10));
    		localStorage.setItem("best-score", newBest);
    		$$invalidate(1, bestScore = newBest);
    		$$invalidate(0, showModal = true);
    	}

    	function handlePlayAgain() {
    		game.reset();
    		$$invalidate(0, showModal = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Game", $$slots, []);

    	$$self.$capture_state = () => ({
    		Board,
    		GameHeader,
    		GameFooter,
    		GameOverModal,
    		game,
    		getInitialBoardSize,
    		moves,
    		rows,
    		columns,
    		showModal,
    		bestScore,
    		score,
    		handleGameOver,
    		handlePlayAgain,
    		$game
    	});

    	$$self.$inject_state = $$props => {
    		if ("showModal" in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ("bestScore" in $$props) $$invalidate(1, bestScore = $$props.bestScore);
    		if ("score" in $$props) $$invalidate(2, score = $$props.score);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showModal, bestScore, score, handleGameOver, handlePlayAgain];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\App.svelte generated by Svelte v3.21.0 */
    const file$7 = "src\\components\\App.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let current;
    	const game = new Game({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(game.$$.fragment);
    			attr_dev(main, "class", "svelte-1bymns");
    			add_location(main, file$7, 23, 0, 396);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(game, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(game);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Game });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        // name: 'world'
      },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
