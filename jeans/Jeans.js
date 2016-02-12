var Jeans = (function() {

    var transformProps = ["x", "y", "scaleX", "scaleY", "rotate"];
    var animationObjects = [];

    function go(element, timeObj, tweenProps, callbackObj) {
        var obj = { element: element, timeObj: timeObj, tweenProps: tweenProps, callbackObj: callbackObj };
        createTransition(obj);
        setTimeout(setProperties, 1, obj);
        animationObjects.push(obj);
        setCallback(obj);
    }

    function createTransition(obj) {
        obj.element.style.transitionProperty = getTransitionProperties(obj.tweenProps);
        obj.element.style.transitionDuration = obj.timeObj.time + "s";
        obj.element.style.transitionTimingFunction = obj.timeObj.ease || "linear";
        obj.element.style.transitionDelay = obj.timeObj.delay + "s" || 0;
    }

    function getTransitionProperties(obj) {
        var hasTransform = false;
        var properties = [];

        for (var key in obj) {
            if (isTransform(key)) {
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
        var hasTransforms = false;

        for (var key in obj.tweenProps) {
            if (!isTransform(key)) {
                setRegularProps(obj, key);
            } else {
                setTransformProps(obj, key);
                hasTransforms = true;
            }
        }

        if(hasTransforms) {
            var translate = ' translate(' + obj.translations.x + 'px, ' + obj.translations.y + 'px)';
            var scale = ' scale(' + obj.translations.scaleX + ', ' + obj.translations.scaleY + ')';
            var rotation = ' rotate(' + obj.translations.rotate + 'deg)';
            obj.element.style.WebkitTransform = obj.element.style.transform = translate + scale + rotation;
        }
    }

    function setRegularProps(obj, key) {
        var value = obj.tweenProps[key];
        value += (key !== "opacity") && (key !== "backgroundColor") ? "px" : "";
        console.log(value);
        obj.element.style[key] = value;
    }

    function setTransformProps(obj, key) {
        if(!obj.translations) {
            obj.translations = {
                x: 0,
                y: 0,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                xOffset: obj.element.offsetLeft,
                yOffset: obj.element.offsetTop,
                rotateOffset: 0,
                scaleXOffset: 0,
                scaleYOffset: 0
            };
        }

        obj.translations[key] = obj.tweenProps[key] - obj.translations[key + "Offset"];
    }

    function setCallback(obj) {
        obj.element.addEventListener('webkitTransitionEnd', complete);
        obj.element.addEventListener('transitionend', complete);
    }

    function complete(event) {
        event.target.removeEventListener('webkitTransitionEnd', complete);
        event.target.removeEventListener('transitionend', complete);
        var obj = getAnimationObjByElement(event.target);
        if(obj.callbackObj) {
            var scope = obj.callbackObj.scope || null;
            var endArgs = obj.callbackObj.endArgs || [];
            obj.callbackObj.end.apply(scope, endArgs);
            cleanAnimationObjects(obj);
        } else {
            cleanAnimationObjects(obj);
        }
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

    function cleanAnimationObjects(obj) {
        var i = animationObjects.length;
        while (i--) {
            if(animationObjects[i] === obj) {
                animationObjects.splice(i, 1);
            }
        }
    }

    function isTransform(value) {
        var i = transformProps.length;
        while(i--) {
            if(value === transformProps[i]) {
                return true;
            }
        }
        return false;
    }

    return {
        go: go
    }
}());
