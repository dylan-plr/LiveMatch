/**
 * jQuery LiveMatch Plugin
 *
 * LiveMatch makes use of the javascript MutationObserver class and jQuery selectors to automatically execute
 * callbacks for matched elements, handling already existing elements as well as
 * dynamically added elements.
 *
 * More details: https://github.com/dylan-plr/LiveMatch.git
 * Requires jQuery v1.7 or later
 */

(function ( $ ) {
    let selectorsAndHandlers = [];
    let handlersHistory = [];

    /**
     * Targets nodes concerned by DOM mutations
     * @param {[MutationRecord]} mutationsList - An array of MutationRecord objects, describing each change that occurred
     */
    function handleMutations(mutationsList) {
        for (const mutation of mutationsList) {
            // if one or more nodes are added to the DOM
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node)=> {
                    // checks if the node is of type element
                    if (node.nodeType === 1) {
                        runHandlers(node);
                        // loops through child nodes too
                        node.querySelectorAll('*').forEach( (childNode)=> {
                            if (childNode.nodeType === 1) {
                                runHandlers(childNode);
                            }
                        });
                    }
                });
            }
            // else if a node has been modified
            else if (mutation.type === 'attributes' && mutation.target.getAttribute(mutation.attributeName) !== mutation.oldValue) {
                let node = mutation.target;
                // checks if the node is of type element
                if (node.nodeType === 1) {
                    runHandlers(node);
                    // loops through child nodes too
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
     * Run handlers for a specific node
     * @param {Node} node - Target node
     */
    function runHandlers(node) {
        // we loop through every selector and handler pairs
        selectorsAndHandlers.forEach(([selector, handler]) => {
            // if a handler is find for the node
            if ($(node).is(selector)) {
                const index = handlersHistory.findIndex(([element]) => element === node);
                // then if the node is not in the history at all
                if (index === -1) {
                    // we add the node along with the handler to the history and run the handler
                    handlersHistory.push([node, [handler]]);
                    handler.apply(node);
                }
                // else if the node is already in the history and the handler is not
                else if (!handlersHistory[index][1].includes(handler)) {
                        // we add the handler alongside the node in the history and run the handler
                        handlersHistory[index][1].push(handler);
                        handler.apply(node);
                }
            }
        });
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document, { childList: true, subtree: true, attributes: true, attributeOldValue: true});

    /**
     * Execute the given handler function on new elements that matches the given selector, now and in the future
     * @param {string} selector - The selector to match against
     * @param {Function} handler - The handler function to execute
     */
    $.onMatch = function(selector, handler){
        selectorsAndHandlers.push([selector, handler]);
        $(selector).each(function(){
            runHandlers(this);
        });
    }

}( jQuery ));
