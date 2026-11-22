/*
 * Runs first in <head> (same nonce'd script as the Trusted Types bootstrap).
 *
 * Stack detectors such as Wappalyzer read a few globals the framework leaves on `window`:
 * `next.version` / `next.appDir` (Next.js) and `MotionIsMounted` (Motion). They only count a
 * property that is window's *own*, so we move these onto Window.prototype as accessors:
 * assignments like `window.next = {...}` land in the setter, reads still work, and
 * `Object.prototype.hasOwnProperty.call(window, "next")` is false.
 *   - next: Next.js still reads/writes `window.next.__pendingUrl`, so the object is kept (minus
 *     `version` and `appDir`, which nothing reads).
 *   - MotionIsMounted: only read to skip "optimized appear" animations, which this site doesn't use.
 */
export const HIDE_STACK_GLOBALS = `(function(){try{
var P=Window.prototype,store={};
Object.defineProperty(P,"next",{configurable:true,get:function(){return store.next},set:function(v){if(v&&typeof v==="object"){delete v.version;delete v.appDir}store.next=v}});
Object.defineProperty(P,"MotionIsMounted",{configurable:true,get:function(){return undefined},set:function(){}});
}catch(e){}})();`;
