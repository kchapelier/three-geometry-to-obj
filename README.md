# three-geometry-to-obj

Takes a THREE.Geometry and returns an OBJ string.

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
threeGeometryToObj(geometry, options)
```

### Arguments

* geometry : an instance of THREE.Geometry.
* options : an optional object.
  * normalSource : Where to retrieve the normal values, either `face` or `vertex`, defaults to `vertex`

## Changelog

### 0.0.1 (2015.10.26) :

* First implementation.

## Roadmap

Retrieve the uv values in the OBJ string.
A better implementation.

## License

MIT
