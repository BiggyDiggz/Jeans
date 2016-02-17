var Jeans = (function() {

    var transformProps = ["x", "y", "scaleX", "scaleY", "rotate"];
    var timeProps = ["time", "ease", "delay"];
    var callbackProps = ["onEnd", "onEndArgs"];
    var FRAME_RATE = 33;
    var animationObjects = [];
    var transformations = [];

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
        var top = easeOutExpo(obj.step++, obj.beginTop, obj.change, totalSteps);
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
                transforms += setTransformProps(obj, key);
            }
        }
        if (obj.transformations) {
           setTransformations(obj);
        }
    }

    function setRegularProps(obj, key) {
        var value = obj.tweenObj[key];
        value += (key !== "opacity") && (key !== "backgroundColor") ? "px" : "";
        obj.element.style[key] = value;
    }

    function setTransformProps(obj, key) {
        if(!contains(transformations, obj)) {
            obj.transformations = { x:0, y:0, rotation:0, scaleX:1, scaleY:1 };

        }

        obj.transformations[key] = obj.tweenObj[key];
    }

    function setTransformations(obj) {
        var translate, scale, rotate;
        translate = ' translate(' + obj.transformations.x + 'px, ' + obj.transformations.y + 'px)';
        scale = ' scale(' + obj.transformations.scaleX + ', ' + obj.transformations.scaleY + ')';
        rotate = ' rotate(' + obj.transformations.rotate + 'deg)';
        obj.element.style.WebkitTransform = obj.element.style.transform = translate + scale + rotate;
    }

    function setCallback(obj) {
        obj.element.addEventListener('webkitTransitionEnd', complete, false);
        obj.element.addEventListener('transitionend', complete, false);
    }

    function complete(event) {
        event.target.removeEventListener('webkitTransitionEnd', complete);
        event.target.removeEventListener('transitionend', complete);
        var obj = getAnimationObjByElement(event.target);
        //obj.element.style.transition = "none";
        executeCallback(obj);
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

	/**  Scroll Easing
     *
     * TERMS OF USE - EASING EQUATIONS

     Open source under the BSD License.

     Copyright © 2001 Robert Penner
     All rights reserved.

     Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

     Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
     Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
     Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

     */

    function easeOutExpo(t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }

    return {
        go: go,
        scrollTo: scrollTo
    }
}());
