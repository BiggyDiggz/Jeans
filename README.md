Jeans
===================

A Javascript engine for animating neat stuff.


Example Usage
```javascript
Jeans.transition(element, { 
  time: 0.5
	x:500, 
	blur: 5,
	ease:'quad-ease-in-out', 
	delay:0.35, 
	onEnd:myFunction, 
	onEndArgs:['foo','bar'] 
	}
); 
```
###Public Methods
**transition**(element: HTMLDomElement, properties: Object): void
Creates a css transition
____
**animation**(element: HTMLDomElement, keyframes: String, properties: Object): void
Creates a css animation
____
**scrollTo**(element: HTMLDomElement, properties: Object): void
Creates a scroll animation
___

###Method Detail
**transition**() method
function transition(element: HTMLDomElement, properties: Object): void
Creates a CSS Transition
**Parameters**
element: HTMLDomElement -- A DOM Element to apply a transition to
properties: Object -- An object that contains key value pairs about the transition

> **Properties May Contain:**
> Duration
> 
> - *time* - the duration of the transition in seconds
> `Jeans.transition(element, { time: 0.5 })`
> 
> Any animatable CSS Property - *left, top, width, height, etc..*
> 
> - CSS properties with dashes in them are camelCased e.g. *background-color* becomes *backgroundColor*
> - Pixel values are numbers so omit "px"  
> `Jeans.transition(element, { left: 50 })`
> - Percentage values are strings
> `Jeans.transition(element, { left: "100%" })`
> - box-shadow values are strings

> Transforms - *x, y, z, rotate, rotateX, rotateZ, scaleX, scaleY, scaleZ, skewX, skewY*
> 
> - Translations and scaling values are numbers e.g.
> `Jeans.transition(element, { x: 50 scaleX: 1.2 })`
> - Rotations and skews are in degrees. Omit "deg" when assigning a rotation or skew value.
> `Jeans.transition(element, { rotate: 30 })`

> Filters - *blur, brightness, contrast, dropShadow, grayscale, hueRotate, invert, saturate, sepia*
> 
> - Omit "px", "%", and "deg" when assigning values to filters 
> `Jeans.transition(element, { blur: 5, brightness: 200 })`
> - blur is a pixel value
> - brightness is a percentage value
> - contrast is a percentage value
> - dropShadow is a pixel value
> - grayscale is a percentage value
> - hueRotate is in degrees
> - invert is a percentage value
> - saturate is a percentage value
> - sepia is a percentage value
> 
> Timing Function
> 
> - *ease* - the value is a string
> `Jeans.transition(element,{ease:"cubic-bezier(1,1,1,1)"})`
> - Jeans comes with several timing functions
 >-"ease-in"  
 -"ease-out"  
 -"ease-in-out"  
-"quad-ease-in"  
-"quad-ease-out"  
-"quad-ease-in-out"  
-"cubic-ease-in"  
-"cubic-ease-out"  
-"cubic-ease-in-out"  
-"quint-ease-in"  
-"quint-ease-out"  
-"quint-ease-in-out"  
-"quart-ease-in"  
-"quart-ease-out"  
-"quart-ease-in-out"  
-"sine-ease-in"  
-"sine-ease-out"  
-"sine-ease-in-out"  
-"expo-ease-in"  
-"expo-ease-out"  
-"expo-ease-in-out"  
-"circ-ease-in"
-"circ-ease-out"  
-"circ-ease-in-out"  
-"back-ease-in"  
-"back-ease-out"  
-"back-ease-in-out" 
> 
> Delay
> 
> - *delay* - the amount of time before a transition begins in seconds
> `Jeans.transition(element, { delay: 0.25 })`
> 
> onEnd
> 
> - *onEnd* - A function called when the transition is complete
> `Jeans.transition(element, { onEnd: myCallback })`
> 
> onEndArgs
> 
> - *onEndArgs* - An array of arguments for the *onEnd* function
> `Jeans.transition(element, { onEnd: myCallback, onEndArgs: ['foo', 'bar'] })`

---
**animation**() method
function animation(element: HTMLDomElement, keyframes: String, properties: Object): void
Creates a CSS Animation
**Parameters**
element: HTMLDomElement -- A DOM Element to apply an animation to
keyframes: String -- CSS keyframes to add to the element
properties: Object -- An object that contains key value pairs about the animation
> **Properties May Contain:**
> Duration
> 
> - *time* - the duration of the animation in seconds
> `Jeans.animation(element, myKeyframes, { time: 0.5 })`
> 
> Timing Function
> 
> - *ease* - the value is a string
> `Jeans.animation(element, myKeyframes, {ease:"cubic-bezier(1,1,1,1)"})`
> - Jeans comes with several timing functions (see timing functions for *transition*)
> 
> Delay
> 
> - *delay* - the amount of time before an animation begins in seconds
> `Jeans.animation(element, myKeyframes, { delay: 0.25 })`
> 
> onEnd
> 
> - *onEnd* - a function called when the transition is complete
> `Jeans.animation(element, myKeyframes, { onEnd: myCallback })`
> 
> onEndArgs
> 
> - *onEndArgs* - an array of arguments for the *onEnd* function
> `Jeans.animation(element, myKeyframes, { onEnd: myCallback, onEndArgs: ['foo', 'bar'] })`

---
