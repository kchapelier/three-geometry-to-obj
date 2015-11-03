"use strict";

var toObj = require('array-to-wavefront-obj');

var treatVector2 = function treatVector2 (vector2, map, array, indices) {
    var key = vector2.x + ',' + vector2.y;

    if (!map.hasOwnProperty(key)) {
        array.push(vector2.x, vector2.y);
        map[key] = Math.round((array.length / 2) - 1);
    }

    indices.push(map[key]);
};

var treatVector3 = function treatVector3 (vector3, map, array, indices) {
    var key = vector3.x + ',' + vector3.y + ',' + vector3.z;

    if (!map.hasOwnProperty(key)) {
        array.push(vector3.x, vector3.y, vector3.z);
        map[key] = Math.round((array.length / 3) - 1);
    }

    indices.push(map[key]);
};

var treat2Values = function treat2Values (x, y, map, array, indices) {
    var key = x + ',' + y;

    if (!map.hasOwnProperty(key)) {
        array.push(x, y);
        map[key] = Math.round((array.length / 2) - 1);
    }

    indices.push(map[key]);
};

var treat3Values = function treat3Values (x, y, z, map, array, indices) {
    var key = x + ',' + y + ',' + z;

    if (!map.hasOwnProperty(key)) {
        array.push(x, y, z);
        map[key] = Math.round((array.length / 3) - 1);
    }

    indices.push(map[key]);
};

var generateCommentString = function generateCommentString (geometry) {
    var idStr = 'THREE.' + geometry.type;

    if (geometry.name) {
        idStr += ' named "' + geometry.name + '"'
    }

    return '# Converted from a ' + idStr + ' with three-geometry-to-obj\n';
};

var unfoldThreeGeometry = function unfoldThreeGeometry (geometry, options, vertices, normals, textures, vertexIndices, normalIndices, textureIndices) {
    var vertexMap = {},
        normalMap = {},
        textureMap = {},
        face,
        i;

    for (i = 0; i < geometry.faces.length; i++) {
        face = geometry.faces[i];

        treatVector3(geometry.vertices[face.a], vertexMap, vertices, vertexIndices);
        treatVector3(geometry.vertices[face.b], vertexMap, vertices, vertexIndices);
        treatVector3(geometry.vertices[face.c], vertexMap, vertices, vertexIndices);

        if (options.normalSource === 'face') {
            treatVector3(face.normal, normalMap, normals, normalIndices);
            treatVector3(face.normal, normalMap, normals, normalIndices);
            treatVector3(face.normal, normalMap, normals, normalIndices);
        } else {
            treatVector3(face.vertexNormals[0], normalMap, normals, normalIndices);
            treatVector3(face.vertexNormals[1], normalMap, normals, normalIndices);
            treatVector3(face.vertexNormals[2], normalMap, normals, normalIndices);
        }
    }

    if (geometry.faceVertexUvs.length && geometry.faceVertexUvs[0].length === geometry.faces.length) {
        for (i = 0; i < geometry.faceVertexUvs[0].length; i++) {
            treatVector2(geometry.faceVertexUvs[0][i][0], textureMap, textures, textureIndices);
            treatVector2(geometry.faceVertexUvs[0][i][1], textureMap, textures, textureIndices);
            treatVector2(geometry.faceVertexUvs[0][i][2], textureMap, textures, textureIndices);
        }
    }
};

var unfoldThreeBufferGeometry = function unfoldThreeBufferGeometry (geometry, options, vertices, normals, textures, vertexIndices, normalIndices, textureIndices) {
    var vertexMap = {},
        normalMap = {},
        textureMap = {},
        positionsAttr = geometry.attributes.position,
        normalsAttr = geometry.attributes.normal,
        uvsAttr = geometry.attributes.uv,
        i;

    for (i = 0; i < positionsAttr.count; i++) {
        treat3Values(positionsAttr.array[i * 3], positionsAttr.array[i * 3 + 1], positionsAttr.array[i * 3 + 2], vertexMap, vertices, vertexIndices);
        treat3Values(normalsAttr.array[i * 3], normalsAttr.array[i * 3 + 1], normalsAttr.array[i * 3 + 2], normalMap, normals, normalIndices);
    }

    if (uvsAttr && uvsAttr.count === positionsAttr.count) {
        for (i = 0; i < uvsAttr.count; i++) {
            treat2Values(uvsAttr.array[i * 2], uvsAttr.array[i * 2 + 1], textureMap, textures, textureIndices);
        }
    }
};

module.exports = function threeGeometryToObj (geometry, options) {
    var vertices = [],
        normals = [],
        textures = [],
        vertexIndices = [],
        normalIndices = [],
        textureIndices = [];

    options = options || {};

    if (geometry.type === 'BufferGeometry') {
        unfoldThreeBufferGeometry(geometry, options, vertices, normals, textures, vertexIndices, normalIndices, textureIndices)
    } else {
        unfoldThreeGeometry(geometry, options, vertices, normals, textures, vertexIndices, normalIndices, textureIndices);
    }

    return generateCommentString(geometry) + toObj(vertices, normals, textures, vertexIndices, normalIndices, textureIndices);
};
