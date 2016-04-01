Jeans
===================

A Javascript engine for animating neat stuff.

###Public Methods
**transition**(element: HTMLDomElement, properties: Object): void<br>
Creates a css transition

**animation**(element: HTMLDomElement, keyframes: String, properties: Object): void<br>
Creates a css animation

**scrollTo**(element: HTMLDomElement, properties: Object): void<br>
Creates a scroll animation


###Method Detail
####**transition()**####
function transition(element: HTMLDomElement, properties: Object): void<br>
**parameters**<br>
element: HTMLDomElement -- A DOM Element to apply a transition to<br>
properties: Object -- An object that contains key value pairs about the transition<br>

> **Properties May Contain:**
>
> Duration
> 
> - *duration* - the duration of the transition in seconds <br>
> `Jeans.transition(element, { duration: 0.5 })`
> 
> Any animatable incremental CSS Property - *left, top, width, height, etc..*
> 
> - CSS properties with dashes are camel cased e.g. *background-color* becomes *backgroundColor*
> - Pixel values are numbers. Omit "px" <br>
> `Jeans.transition(element, { left: 50 })`
> - Percentage values are strings <br>
> `Jeans.transition(element, { left: "100%" })`
> - box-shadow values are strings
> `Jeans.transition(element, { dropShadow: "8px 8px 5px rgba(0, 0, 0, 0.25)" })`
>
> Transforms - *x, y, z, rotate, rotateX, rotateZ, scaleX, scaleY, scaleZ, skewX, skewY*
> 
> - Translations and scaling values are numbers <br>
> `Jeans.transition(element, { x: 50 scaleX: 1.2 })`
> - Rotations and skews are in degrees. Omit "deg" when assigning a rotation or skew value  <br>
> `Jeans.transition(element, { rotate: 30 })`

> Filters - *blur, brightness, contrast, dropShadow, grayscale, hueRotate, invert, saturate, sepia*
> 
> - Omit "px", "%", and "deg" when assigning values to filters <br>
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
> - *ease* - the value is a string <br>
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
> - *delay* - the amount of time before a transition begins in seconds <br>
> `Jeans.transition(element, { delay: 0.25 })`
> 
> onEnd
> 
> - *onEnd* - A function called when the transition is complete <br>
> `Jeans.transition(element, { onEnd: myCallback })`
> 
> onEndArgs
> 
> - *onEndArgs* - An array of arguments for the *onEnd* callback <br>
> `Jeans.transition(element, { onEnd: myCallback, onEndArgs: ['foo', 'bar'] })`

Example Usage
```javascript
Jeans.transition(element, { 
  duration: 0.5
	x:500, 
	blur: 5,
	ease:'quad-ease-in-out', 
	delay:0.35, 
	onEnd:myFunction, 
	onEndArgs:['foo','bar'] 
	}
); 
```

<br>
####**animation()**####
function animation(element: HTMLDomElement, keyframes: String, properties: Object): void<br>
**Parameters**<br>
element: HTMLDomElement -- A DOM Element to apply an animation to<br>
keyframes: String -- CSS keyframes to add to the element<br>
properties: Object -- An object that contains key value pairs about the animation
> **Properties May Contain:** <br>
> Duration
> 
> - *duration* - the duration of the animation in seconds <br>
> `Jeans.animation(element, myKeyframes, { duration: 0.5 })`
> 
> Timing Function
> 
> - *ease* - the value is a string <br>
> `Jeans.animation(element, myKeyframes, {ease:"cubic-bezier(1,1,1,1)"})`
> - Jeans comes with several timing functions (see timing functions for *transition*)
> 
> Delay
> 
> - *delay* - the amount of time before an animation begins in seconds <br>
> `Jeans.animation(element, myKeyframes, { delay: 0.25 })`
> 
> onEnd
> 
> - *onEnd* - a function called when the transition is complete <br>
> `Jeans.animation(element, myKeyframes, { onEnd: myCallback })`
> 
> onEndArgs
> 
> - *onEndArgs* - an array of arguments for the *onEnd* function <br>
> `Jeans.animation(element, myKeyframes, { onEnd: myCallback, onEndArgs: ['foo', 'bar'] })`

Example Usage
```javascript
Jeans.animation(element, myKeyframes, { 
    duration: 0.25, 
    ease: "sine-ease-in", 
    delay: 0.5,
    onEnd:myFunction, 
    onEndArgs:['foo','bar'] 
  }
); 
```

<br>
####**scrollTo()**#####
function scrollTo(element: HTMLDomElement, properties: Object): void<br>
**Parameters**<br>
element: HTMLDomElement -- A DOM Element to apply a scroll to<br>
properties: Object -- An object that contains key value pairs about the scroll animation<br>
> **Properties May Contain:** <br>
> Duration
> 
> - *duration* - the duration of the scroll in seconds <br>
> `Jeans.scrollTo(element, { duration: 0.5 })`
> 
> ScrollTop
> 
> - *top* - the end scroll position of the element <br>
> `Jeans.scrollTop(element, { top: 0 })` 
>
> Delay
> 
> - *delay* - the amount of time before the scrollTop animation begins in seconds <br>
> `Jeans.scrollTop(element, { delay: 0 })`
> 
> onEnd
> 
> - *onEnd* - a function called when the scrollTop animation is complete <br>
> `Jeans.scrollTop(element, { onEnd: myCallback })`
> 
> onEndArgs
> 
> - *onEndArgs* - an array of arguments for the *onEnd* function <br>
> `Jeans.scrollTop(element, { onEnd: myCallback, onEndArgs: ['foo', 'bar'] })`

Example Usage
```javascript
Jeans.scrollTo(element, { 
    duration: 0.5
    top: 0,
    onEnd:myFunction, 
    onEndArgs:['foo','bar'] 
  }
); 
```
