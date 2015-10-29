"use strict";

var toObj = require('array-to-wavefront-obj'),
    commentString = '# Converted from a Three.Geometry with three-geometry-to-obj\n';

//FIXME treatVertex and treatNormal are currently the same
//TODO is it worth it to include a polyfill of es6 Map for vertexMap and normalMap

var treatUv = function treatUv (uv, uvMap, uvArray, uvIndices) {
    var key = uv.x + ',' + uv.y;

    if (!uvMap.hasOwnProperty(key)) {
        uvArray.push(uv.x);
        uvArray.push(uv.y);
        uvMap[key] = Math.round((uvArray.length / 2) - 1);
    }

    uvIndices.push(uvMap[key]);
};

var treatVertex = function treatVertex (vertex, vertexMap, vertexArray, vertexIndices) {
    var key = vertex.x + ',' + vertex.y + ',' + vertex.z;

    if (!vertexMap.hasOwnProperty(key)) {
        vertexArray.push(vertex.x);
        vertexArray.push(vertex.y);
        vertexArray.push(vertex.z);
        vertexMap[key] = Math.round((vertexArray.length / 3) - 1);
    }

    vertexIndices.push(vertexMap[key]);
};

var treatNormal = function treatNormal (normal, normalMap, normalArray, normalIndices) {
    var key = normal.x + ',' + normal.y + ',' + normal.z;

    if (!normalMap.hasOwnProperty(key)) {
        normalArray.push(normal.x);
        normalArray.push(normal.y);
        normalArray.push(normal.z);
        normalMap[key] = Math.round((normalArray.length / 3) - 1);
    }

    normalIndices.push(normalMap[key]);
};

module.exports = function threeGeometryToObj (geometry, options) {

    options = options || {};

    var vertexMap = {},
        normalMap = {},
        textureMap = {},
        vertices = [],
        normals = [],
        textures = [],
        vertexIndices = [],
        normalIndices = [],
        textureIndices = [];

    var face;

    for (var i = 0; i < geometry.faces.length; i++) {
        face = geometry.faces[i];

        treatVertex(geometry.vertices[face.a], vertexMap, vertices, vertexIndices);
        treatVertex(geometry.vertices[face.b], vertexMap, vertices, vertexIndices);
        treatVertex(geometry.vertices[face.c], vertexMap, vertices, vertexIndices);

        if (options.normalSource === 'face') {
            treatNormal(face.normal, normalMap, normals, normalIndices);
            treatNormal(face.normal, normalMap, normals, normalIndices);
            treatNormal(face.normal, normalMap, normals, normalIndices);
        } else {
            treatNormal(face.vertexNormals[0], normalMap, normals, normalIndices);
            treatNormal(face.vertexNormals[1], normalMap, normals, normalIndices);
            treatNormal(face.vertexNormals[2], normalMap, normals, normalIndices);
        }
    }

    if (geometry.faceVertexUvs.length && geometry.faceVertexUvs[0].length === geometry.faces.length) {
        for (var i = 0; i < geometry.faceVertexUvs[0].length; i++) {
            treatUv(geometry.faceVertexUvs[0][i][0], textureMap, textures, textureIndices);
            treatUv(geometry.faceVertexUvs[0][i][1], textureMap, textures, textureIndices);
            treatUv(geometry.faceVertexUvs[0][i][2], textureMap, textures, textureIndices);
        }
    }

    return commentString + toObj(vertices, normals, textures, vertexIndices, normalIndices, textureIndices);
};
