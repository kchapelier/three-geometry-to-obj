# three-geometry-to-obj

Takes a THREE.Geometry or a THREE.BufferGeometry and returns an OBJ string.

Mostly a convenience wrapper around [array-to-wavefront-obj](https://www.npmjs.com/package/array-to-wavefront-obj).

## Installing

With [npm](http://npmjs.org) do:

```
npm install three-geometry-to-obj
```

## Example

```js
var threeGeometryToObj = require('three-geometry-to-obj');

console.log(threeGeometryToObj(geometry, { normalSource: 'face' }));
```

## API

```js
threeGeometryToObj(geometry, options);
```

### Arguments

* geometry : an instance of THREE.Geometry or THREE.BufferGeometry (non-indexed only currently).
* options : an optional object.
  * normalSource : On THREE.Geometry, where to retrieve the normal values, either `face` or `vertex`, defaults to `vertex`

## Changelog

### 0.1.0 (2015.11.03) :

* Add support for non-indexed THREE.BufferGeometry.
* Retrieve the name of the geometry in the comment string.

### 0.0.2 (2015.10.29) :

* Takes advantage of the different indices in `array-to-wavefront-obj` to reduce the string length.
* Now retrieve the uv values.

### 0.0.1 (2015.10.26) :

* First implementation.

## Roadmap

* Tests
* Supports for indexed THREE.BufferGeometry

## License

MIT
