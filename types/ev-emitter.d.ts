
/**
 * EvEmitter
 *
 * Adds publish/subscribe pattern to a browser class. It's a smaller
 * version of [olical/EventEmitter](https://github.com/Olical/EventEmitter).
 * That EventEmitter is full featured, widely used, and great.
 * This EvEmitter has just the base event functionality to power the event API
 * in libraries like [isotope](https://isotope.metafizzy.co/),
 * [flickity](https://flickity.metafizzy.co/), [masonry](https://masonry.desandro.com/),
 * and [imagesLoaded](https://imagesloaded.desandro.com/).
 */
 declare module 'ev-emitter' {

  /**
   * EvEmitter
   *
   * Lil' event emitter — add a little pub/sub
   */
  export default class EvEmitter {

    /**
     * Add an event listener.
     *
     * @param {eventName} eventName name of the event
     * @param {listener} listener some function
     */
    on(eventName: string, listener: Function): this
    /**
     * Add an event listener to be triggered only once.
     *
     * @param {eventName} eventName name of the event
     * @param {listener} listener some function
     */
    once(eventName: string, listener: Function): this
    /**
     * Remove an event listener.
     *
     * @param {eventName} eventName name of the event
     * @param {listener} listener some function
     */
    off(eventName: string, listener: Function): this
    /**
     * Trigger an event.
     *
     * @param {eventName} eventName name of the event
     * @param {args} args arguments passed to listeners
     */
    emitEvent(eventName: string, args?: any[]): this
    /**
     * Removes all event listeners.
     */
    allOff(): void

  }

}
