"use strict";

var toObj = require('array-to-wavefront-obj'),
    commentString = '# Converted from a Three.Geometry with three-geometry-to-obj\n';

var treatVector2 = function treatVector2 (vector2, map, array, indices) {
    var key = vector2.x + ',' + vector2.y;

    if (!map.hasOwnProperty(key)) {
        array.push(vector2.x);
        array.push(vector2.y);
        map[key] = Math.round((array.length / 2) - 1);
    }

    indices.push(map[key]);
};

var treatVector3 = function treatVector3 (vector3, map, array, indices) {
    var key = vector3.x + ',' + vector3.y + ',' + vector3.z;

    if (!map.hasOwnProperty(key)) {
        array.push(vector3.x);
        array.push(vector3.y);
        array.push(vector3.z);
        map[key] = Math.round((array.length / 3) - 1);
    }

    indices.push(map[key]);
};

module.exports = function threeGeometryToObj (geometry, options) {
    var vertexMap = {},
        normalMap = {},
        textureMap = {},
        vertices = [],
        normals = [],
        textures = [],
        vertexIndices = [],
        normalIndices = [],
        textureIndices = [],
        face,
        i;

    options = options || {};

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

    return commentString + toObj(vertices, normals, textures, vertexIndices, normalIndices, textureIndices);
};
