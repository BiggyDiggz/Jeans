/**
 * The MIT License (MIT)

 Copyright (c) 2016 William Do

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var Jeans = (function() {

	var FRAME_RATE = 33;

	var transformProps = ["x", "y", "z", "scaleX", "scaleY", "scaleZ", "rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];
	var filters = ["blur", "brightness", "contrast", "dropShadow", "grayscale", "hueRotate", "invert", "saturate", "sepia"];
	var timeProps = ["time", "ease", "delay"];
	var callbackProps = ["onEnd", "onEndArgs"];
	var overwriteTransform = "overwriteTransform";
	var hardwareAccelerate = "hardwareAccelerate";
	var animationObjects = [];

	/** Matthew Lein's easing functions
	 * http://matthewlein.com/ceaser/
	 * @matthewlein
	 */
	var eases = {}, cb = 'cubic-bezier', qd = 'quad-', cu = 'cubic-', qt = 'quart-',
		qn = 'quint-', si = 'sine-', ex = 'expo-', ci = 'circ-',
		bk= 'back-', ei = 'ease-in', o ='-out', eo = 'ease-out', eio='ease-in-out';
	eases.linear = 'linear';
	eases[ei] = ei; //ease-in
	eases[eo] = eo; //ease-out
	eases[eio] = eio; //ease-in-out

	eases[qd + ei] = cb + '(0.550, 0.085, 0.680, 0.530)'; //quad-ease-in
	eases[cu + ei] = cb + '(0.550, 0.055, 0.675, 0.190)'; //cubic-ease-in
	eases[qt + ei] = cb + '(0.895, 0.030, 0.685, 0.220)'; //quart-ease-in
	eases[qn + ei] = cb + '(0.755, 0.050, 0.855, 0.060)'; //quint-ease-in
	eases[si + ei] = cb + '(0.470, 0, 0.745, 0.715)'; //sine-ease-in
	eases[ex + ei] = cb + '(0.950, 0.050, 0.795, 0.035)'; //expo-ease-in
	eases[ci + ei] = cb + '(0.600, 0.040, 0.980, 0.335)'; //circ-ease-in
	eases[bk + ei] = cb + '(0.600, -0.280, 0.735, 0.045)'; //back-ease-in

	eases[qd + eo] = cb + '(0.250, 0.460, 0.450, 0.940)'; //quad-ease-out
	eases[cu + eo] = cb + '(0.215, 0.610, 0.355, 1)'; //cubic-ease-out
	eases[qt + eo] = cb + '(0.165, 0.840, 0.440, 1)'; //quart-ease-out
	eases[qn + eo] = cb + '(0.230, 1, 0.320, 1)'; //quint-ease-out
	eases[si + eo] = cb + '(0.390, 0.575, 0.565, 1)'; //sine-ease-out
	eases[ex + eo] = cb + '(0.190, 1, 0.220, 1)'; //expo-ease-out
	eases[ci + eo] = cb + '(0.075, 0.820, 0.165, 1)'; //circ-ease-out
	eases[bk + eo] = cb + '(0.175, 0.885, 0.320, 1.275)'; //back-ease-out

	eases[qd + eio] = cb + '(0.455, 0.030, 0.515, 0.955)'; //quad-ease-in-out
	eases[cu + eio] = cb + '(0.645, 0.045, 0.355, 1)'; //cubic-ease-in-out
	eases[qt + eio] = cb + '(0.770, 0, 0.175, 1)'; //quart-ease-in-out
	eases[qn + eio] = cb + '(0.860, 0, 0.070, 1)'; //quint-ease-in-out
	eases[si + eio] = cb + '(0.445, 0.050, 0.550, 0.950)'; //sine-ease-in-out
	eases[ex + eio] = cb + '(1, 0, 0, 1)'; //expo-ease-in-out
	eases[ci + eio] = cb + '(0.785, 0.135, 0.150, 0.860)'; //circ-ease-in-out
	eases[bk + eio] = cb + '(0.680, -0.550, 0.265, 1.550)'; //back-ease-in-out

	/**
	 * @param {HTMLElement} element
	 * @param {object} props Transition properties
	 * @param {number} props.time The duration of the transition in seconds
	 * @param {number} props.delay A delay in seconds that occurs before the transition starts
	 * @param {string} props.ease An easing equation applied to the transition
	 * @param {function} props.onEnd A function that is called when the transition ends
	 * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
	 * @param {boolean} props.hardwareAccelerated A boolean value that turns on hardwareAcceleration by adding translateZ to the transition transformation
	 * @param {number} props.x props.y props.left, props.opacity etc... CSS values to transition to
	 */
	function transition(element, props) {
		var obj = { element: element, props: props, transformations: {} };
		animationObjects.push(obj);
		parseProperties(obj);
		createTransition(obj);
		setTimeout(setProperties, 1, obj);
		setCallback(obj);
	}

	/**
	 * @param {HTMLElement} element
	 * @param {string} keyframes A name of a keyframe animation
	 * @param {object} props Animation properties
	 * @param {number} props.time The duration of the animation in seconds
	 * @param {number} props.delay A delay in seconds that occurs before the animation starts
	 * @param {string} props.ease An easing equation applied to the animation
	 * @param {function} props.onEnd A function that is called when the animation ends
	 * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
	 */
	function animation(element, keyframes, props) {
		var obj = { element: element, keyframes: keyframes, props: props };
		animationObjects.push(obj);
		parseProperties(obj);
		createAnimation(obj);
		setCallback(obj);
	}

	/**
	 * @param {HTMLElement} element
	 * @param {object} props Scroll animation properties
	 * @param {number} props.time The duration of the transition in seconds
	 * @param {number} props.delay A delay in seconds that occurs before the scroll starts
	 * @param {function} props.onEnd A function that is called when the scrolling animation ends
	 * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
	 */
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
		var nonTweenProps = timeProps.concat(callbackProps, [overwriteTransform, hardwareAccelerate]);
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
		var ease = obj.ease || "linear";
		obj.element.style.transitionProperty = getTransitionProperties(obj.tweenObj);
		obj.element.style.transitionDuration = time + "s";
		obj.element.style.transitionTimingFunction = eases[ease] || ease;
		obj.element.style.transitionDelay = delay + "s";
	}

	function createAnimation(obj) {
		var time = obj.time || 0, delay = obj.delay || 0;
		obj.element.style.animationName = obj.keyframes;
		obj.element.style.animationDuration = time + "s";
		obj.element.style.animationTimingFunction = obj.ease || "linear";
		obj.element.style.animationDelay = delay + "s";
		obj.element.style.animationFillMode = "both";
	}

	function getTransitionProperties(obj) {
		var hasTransform = false;
		var hasFilter = false;
		var properties = [];

		for (var key in obj) {
			if (contains(transformProps, key)) {
				hasTransform = true;
			} else if (contains(filters, key)) {
				hasFilter = true;
			}
			else {
				properties.push(camelCaseToDash(key));
			}
		}

		if (hasTransform) {
			properties.push("transform");
		}
		if (hasFilter) {
			properties.push("-webkit-filter");
			properties.push("filter");
		}

		return properties.join(", ");
	}

	function setProperties(obj) {
		var key;
		for (key in obj.tweenObj) {
			if (contains(transformProps, key)) {
				setTransformValues(obj, key);
			} else if (contains(filters, key)) {
				setFilterValues(obj, key);
			} else {
				setRegularValues(obj, key);
			}
		}
		if (obj.transformations) {
			setTransformations(obj);
		}
	}

	function setRegularValues(obj, key) {
		var value = obj.tweenObj[key];
		if(value.toString().indexOf("%") === -1) {
			value += (key !== "opacity") && (key !== "backgroundColor") && (key !== "boxShadow") ? "px" : "";
		}
		obj.element.style[key] = value;
	}

	function setFilterValues(obj, key) {
		var value = obj.tweenObj[key];
		if (key === "hueRotate") {
			value = "(" + value + "deg)";
		} else {
			value = key === "blur" ? "(" + value + "px)" : "(" + value + "%)";
		}
		key = camelCaseToDash(key);
		obj.element.style.webkitFilter = key + value;
		obj.element.style.filter = key + value;
	}

	function setTransformValues(obj, key) {
		if(/x|y|z|scaleX|scaleY|scaleZ|rotate|rotateX|rotateY|rotateZ|skewX|skewY/.test(key)) {
			obj.transformations[key] = obj.tweenObj[key];
		}
	}

	function setTransformations(obj) {
		var rotate = "", scale = "", skew = "", translate = "";
		if (obj.overwriteTransform === undefined || obj.overwriteTransform) {
			var trans = obj.transformations;
			translate += trans.x !== undefined && trans.x ? "translateX(" + trans.x + "px) " : "";
			translate += trans.y !== undefined && trans.y ? "translateY(" + trans.y + "px) " : "";
			translate += trans.z !== undefined && trans.z ? "translateZ(" + trans.z + "px) " : "";
			rotate += trans.rotate !== undefined && trans.rotate ? "rotate(" + trans.rotate + "deg) " : "";
			rotate += trans.rotateX !== undefined && trans.rotateX ? "rotateX(" + trans.rotateX + "deg) " : "";
			rotate += trans.rotateY !== undefined && trans.rotateY ? "rotate(" + trans.rotateY + "deg) " : "";
			rotate += trans.rotateZ !== undefined && trans.rotateZ ? "rotate(" + trans.rotateZ + "deg) " : "";
			scale += trans.scaleX !== undefined && trans.scaleX ? "scaleX(" + trans.scaleX + ") " : "";
			scale += trans.scaleY !== undefined && trans.scaleY ? "scaleY(" + trans.scaleY + ") " : "";
			scale += trans.scaleZ !== undefined && trans.scaleZ ? "scaleZ(" + trans.scaleZ + ") " : "";
			skew += trans.skewX !== undefined && trans.skewX ? "skewX(" + trans.skewX + "deg) " : "";
			skew += trans.skewY !== undefined && trans.skewY ? "skewY(" + trans.skewY + "deg) " : "";
		}

		if ((obj.hardwareAccelerate !== undefined || obj.hardwareAccelerate) && trans.z === undefined) {
			translate += "translateZ(0) ";
		}

		obj.element.style.transform = translate + rotate + scale + skew;
	}

	function setCallback(obj) {
		obj.element.addEventListener("webkitTransitionEnd", complete, false);
		obj.element.addEventListener("transitionend", complete, false);
		obj.element.addEventListener("webkitAnimationEnd", complete, false);
		obj.element.addEventListener("animationend", complete, false);
	}

	function complete(event) {
		event.target.removeEventListener("webkitTransitionEnd", complete);
		event.target.removeEventListener("transitionend", complete);
		event.target.removeEventListener("webkitAnimationEnd", complete);
		event.target.removeEventListener("animationend", complete);
		var obj = getAnimationObjByElement(event.target);
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

	function camelCaseToDash(value) {
		return value.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
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
		transition: transition,
		animation: animation,
		scrollTo: scrollTo
	}
}());