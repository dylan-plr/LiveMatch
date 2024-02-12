/**
 * jQuery LiveMatch Plugin
 *
 * LiveMatch makes use of the javascript MutationObserver class to execute callback functions on
 * new elements added to the DOM that match a specific jQuery selector.
 * It handles already existing elements as well as dynamically added elements.
 *
 * Requires jQuery v1.7 or later
 */

(function ( $ ) {

    let selectorsAndHandlers = [];
    let handlersHistory = [];
    
    /**
     * Run handlers for a specific node
     * @param {Node} node - Target node
     */
    function runHandlers(node) {
        selectorsAndHandlers.forEach(([selector, handler]) => {
            if ($(node).is(selector)) {
                const index = handlersHistory.findIndex(([element]) => element === node);
                if (index === -1) {
                    handlersHistory.push([node, [handler]]);
                    handler.apply(node);
                }
                else if (!handlersHistory[index][1].includes(handler)) {
                    handlersHistory[index][1].push(handler);
                    handler.apply(node);
                }
            }
        });
    }

    /**
     * Targets nodes concerned by DOM mutations
     * @param {[MutationRecord]} mutationsList - An array of MutationRecord objects, describing each change that occurred
     */
    function handleMutations(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node)=> {
                    if (node.nodeType === 1) {
                        runHandlers(node);
                        node.querySelectorAll('*').forEach( (childNode)=> {
                            if (childNode.nodeType === 1) {
                                runHandlers(childNode);
                            }
                        });
                    }
                });
            }
            else if (mutation.type === 'attributes' && mutation.target.getAttribute(mutation.attributeName) !== mutation.oldValue) {
                let node = mutation.target;
                if (node.nodeType === 1) {
                    runHandlers(node);
                    node.querySelectorAll('*').forEach( (childNode)=> {
                        if (childNode.nodeType === 1) {
                            runHandlers(childNode);
                        }
                    });
                }
            }
        }
    }

    /**
     * Execute the given handler function on new elements that matches the given selector, now and in the future
     * @param {selector} selector - The selector to match against
     * @param {Function} handler - The handler function to execute
     */
    $.onMatch = function(selector, handler){
        selectorsAndHandlers.push([selector, handler]);
        $(selector).each(function(){
            runHandlers(this);
        });
        return this;
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document, { childList: true, subtree: true, attributes: true, attributeOldValue: true});

}( jQuery ));
