var Jeans = (function() {

    var transformProps = ["x", "y", "scaleX", "scaleY", "rotate"];
    var timeProps = ["time", "ease", "delay"];
    var callbackProps = ["onEnd", "onEndArgs"];
    var FRAME_RATE = 33;
    var animationObjects = [];

    function go(element, props) {
        var obj = { element: element, props: props };
        parseProperties(obj);
        createTransition(obj);
        animationObjects.push(obj);
        setTimeout(setProperties, 1, obj);
        setCallback(obj);
    }

    function scrollTo(element, props) {
        var obj = { element: element, props: props, step: 0 };
        setScrollProperties(obj);
        if (obj.props.delay) {
            setTimeout(function() {
                animateScroll(obj);
            }, obj.props.delay * 1000);
        } else {
            animateScroll(obj);
        }
        animationObjects.push(obj);
    }

    function setScrollProperties(obj) {
        obj.beginTop = obj.element.scrollTop;
        obj.change = obj.props.top - obj.beginTop;
        obj.props.time = obj.props.time * 1000;
    }

    function parseProperties(obj) {
        var nonTweenProps = timeProps.concat(callbackProps);
        obj.tweenObj = {};
        for (key in obj.props) {
            if (contains(nonTweenProps, key)) {
                obj[key] = obj.props[key];
            } else {
                obj.tweenObj[key] = obj.props[key];
            }
        }
    }

    function animateScroll(obj) {
        var totalSteps = obj.props.time / FRAME_RATE;
        var top = jsEaseOut(obj.step++, obj.beginTop, obj.change, totalSteps);
        obj.element.scrollTop = top;
        if (obj.step >= totalSteps) {
            obj.element.scrollTop = obj.props.top;
            executeCallback(obj.props);
            removeAnimationObject(obj);
        } else {
            setTimeout(function () {
                requestAnimationFrame(function () {
                    animateScroll(obj);
                });
            }, FRAME_RATE);
        }
    }

    function jsEaseOut(t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }

    function createTransition(obj) {
        var time = obj.time || 0, delay = obj.delay || 0;
        obj.element.style.transitionProperty = getTransitionProperties(obj.tweenObj);
        obj.element.style.transitionDuration = time + "s";
        obj.element.style.transitionTimingFunction = obj.ease || "linear";
        obj.element.style.transitionDelay = delay + "s";
    }

    function getTransitionProperties(obj) {
        var hasTransform = false;
        var properties = [];

        for (var key in obj) {
            if (contains(transformProps, key)) {
                hasTransform = true;
            } else {
                key = key.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
                properties.push(key);
            }
        }

        if (hasTransform) {
            properties.push("transform");
        }

        return properties.join(", ");
    }

    function setProperties(obj) {
        var key, transforms = "";
        for (key in obj.tweenObj) {
            if (!contains(transformProps, key)) {
                setRegularProps(obj, key);
            } else {
                transforms += setTransformProps(obj.tweenObj, key);
            }
        }

        if(transforms.length > 0) {
            obj.element.style.transform = transforms;
        }
    }

    function setRegularProps(obj, key) {
        var value = obj.tweenObj[key];
        value += (key !== "opacity") && (key !== "backgroundColor") ? "px" : "";
        obj.element.style[key] = value;
    }

    function setTransformProps(tweenObj, key) {
        if (/x|y|z/.test(key)) {
            return 'translate' + key.toUpperCase() + '(' + tweenObj[key] + 'px) ';
        } else if (key.indexOf('scale') > -1) {
            return key + '(' + tweenObj[key] + ') ';
        } else if ( key === 'rotate') {
            return 'rotate(' + tweenObj[key] + 'deg) ';
        }
    }

    function setCallback(obj) {
        obj.element.addEventListener('webkitTransitionEnd', complete, false);
        obj.element.addEventListener('transitionend', complete, false);
    }

    function complete(event) {
        event.target.removeEventListener('webkitTransitionEnd', complete);
        event.target.removeEventListener('transitionend', complete);
        var obj = getAnimationObjByElement(event.target);
        executeCallback(obj);
        obj.element.style.transition = "none";
        removeAnimationObject(obj);
    }

    function getAnimationObjByElement(element) {
        var i = animationObjects.length;
        while (i--) {
            if(animationObjects[i].element === element) {
                return animationObjects[i];
            }
        }
        return null;
    }

    function removeAnimationObject(obj) {
        var i = animationObjects.length;
        while (i--) {
            if(animationObjects[i] === obj) {
                animationObjects.splice(i, 1);
            }
        }
    }

    function executeCallback(obj) {
        if(obj.onEnd) {
            var endArgs = obj.onEndArgs || [];
            obj.onEnd.apply(null, endArgs);
        }
    }

    function contains(array, value) {
        var i = array.length;
        while(i--) {
            if(value === array[i]) {
                return true;
            }
        }
        return false;
    }

    return {
        go: go,
        scrollTo: scrollTo
    }
}());
